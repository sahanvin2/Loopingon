const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Patching route.ts to log cookies...');
    const patchCode = `
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/';

  const cookieStore = await cookies();
  console.log('--- CALLBACK HIT ---');
  console.log('All Cookies:', cookieStore.getAll());
  
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      return NextResponse.redirect(new URL(next, process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin));
    } else {
      console.error('OAuth Code Exchange Error:', error.message);
    }
  }

  // Fallback to error or home page if something went wrong
  return NextResponse.redirect(new URL('/?error=auth', process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin));
}
    `;
    
    await ssh.execCommand(`cat << 'EOF' > /app/apps/web/src/app/auth/callback/route.ts
${patchCode}
EOF
`, { cwd: '/opt/loopingon' });

    // We don't need to rebuild if it's not possible easily, but wait, Next.js standalone build means we MUST rebuild!
    // Or we can just log cookies via NGINX or run a script?
    
    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
