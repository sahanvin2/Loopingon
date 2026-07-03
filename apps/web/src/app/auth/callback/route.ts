import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && session?.user) {
      const user = session.user;
      
      try {
        // Determine provider (google or facebook)
        const provider = user.app_metadata?.provider || 'google';
        
        // Build the profile for the Express API
        const profile = {
          id: user.user_metadata?.provider_id || user.id,
          authUserId: user.id,
          email: user.email || '',
          name: user.user_metadata?.full_name || user.user_metadata?.name || '',
          picture: user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
        };

        // Call the Express backend to get custom JWTs
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://server:4000/api/v1';
        const queryParams = new URLSearchParams(profile as any).toString();
        const response = await fetch(`${apiUrl}/auth/${provider}/callback?${queryParams}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
          const apiData = await response.json();
          if (apiData.data?.accessToken && apiData.data?.refreshToken) {
            // Set temporary cookie for client to pick up
            const cookieStore = await cookies();
            const tokensObj = JSON.stringify({
              accessToken: apiData.data.accessToken,
              refreshToken: apiData.data.refreshToken,
              user: apiData.data.user
            });
            cookieStore.set('auth_sync_tokens', tokensObj, {
              path: '/',
              maxAge: 60, // 60 seconds is enough to sync
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production'
            });
          }
        }
      } catch (err) {
        console.error('Failed to sync with Express API:', err);
      }

      return NextResponse.redirect(new URL(next, process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin));
    } else {
      console.error('OAuth Code Exchange Error:', error?.message);
    }
  }

  // Fallback to error or home page if something went wrong
  return NextResponse.redirect(new URL('/?error=auth', process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin));
}
