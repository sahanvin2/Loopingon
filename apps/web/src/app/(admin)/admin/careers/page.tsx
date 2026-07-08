"use client";

import React, { useState, useEffect } from "react";
import { get, post, patch, del } from "@/lib/api-client";
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/shared/badge";

export default function AdminCareersPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "", department: "", location: "Rambukkana, Kegalle", type: "Full-time", description: ""
  });

  const fetchJobs = async () => {
    try {
      const res = await get<any>("/admin/jobs?includeClosed=true"); // The API route expects this
      setJobs(res.data || []);
    } catch (e) {
      // Fallback if not mounted to /admin/jobs, use /jobs
      try {
        const res2 = await get<any>("/jobs?includeClosed=true");
        setJobs(res2.data || []);
      } catch (err) {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await patch(`/jobs/${id}/status`, { isOpen: !currentStatus });
      fetchJobs();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    try {
      await del(`/jobs/${id}`);
      fetchJobs();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await post("/jobs", formData);
      setIsModalOpen(false);
      setFormData({ title: "", department: "", location: "Rambukkana, Kegalle", type: "Full-time", description: "" });
      fetchJobs();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold font-serif text-navy-900">Job Positions</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#E63946] text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          <Plus className="w-4 h-4" /> Add Position
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-surface-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-surface-50 text-text-600 text-sm">
            <tr>
              <th className="p-4 font-semibold">Title</th>
              <th className="p-4 font-semibold">Department</th>
              <th className="p-4 font-semibold">Location</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-200 text-sm">
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-muted-500">Loading...</td></tr>
            ) : jobs.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-muted-500">No jobs found.</td></tr>
            ) : (
              jobs.map(job => (
                <tr key={job.id} className="hover:bg-surface-50 transition">
                  <td className="p-4 font-medium text-navy-900">{job.title}</td>
                  <td className="p-4 text-text-600">{job.department}</td>
                  <td className="p-4 text-text-600">{job.location}</td>
                  <td className="p-4">
                    <Badge variant={job.isOpen ? "green" : "muted"}>
                      {job.isOpen ? "Open" : "Closed"}
                    </Badge>
                  </td>
                  <td className="p-4 flex items-center gap-3">
                    <button 
                      onClick={() => handleToggleStatus(job.id, job.isOpen)}
                      className={`text-xs px-2 py-1 rounded ${job.isOpen ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}
                    >
                      {job.isOpen ? 'Close' : 'Open'}
                    </button>
                    <button onClick={() => handleDelete(job.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Position</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input required className="w-full border p-2 rounded" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Department</label>
                <input required className="w-full border p-2 rounded" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input required className="w-full border p-2 rounded" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select className="w-full border p-2 rounded" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea required className="w-full border p-2 rounded" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-navy-900 text-white rounded hover:bg-navy-800">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
