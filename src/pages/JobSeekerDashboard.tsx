// import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useStore } from "../store";
import { useEffect, useState } from "react";
import { getApplicationsByUser } from "../api/getApplications";
import { differenceInCalendarWeeks } from "date-fns";

function JobSeekerDashboard() {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const currentUser = useStore((state) => state.currentUser);

  const [userApplications, setUserApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  console.log("userApplications", userApplications);

  const sortedApps = [...userApplications].sort(
    (a, b) =>
      new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime()
  );

  const firstDate =
    sortedApps.length > 0 ? new Date(sortedApps[0].appliedDate) : new Date();

  const weeklyData = userApplications.reduce(
    (acc: Record<string, number>, app) => {
      const applied = new Date(app.appliedDate);
      const weekDiff = differenceInCalendarWeeks(applied, firstDate); // Week 0 => Week 1
      const label = `Week ${weekDiff + 1}`;
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    },
    {}
  );

  const chartData = Object.entries(weeklyData).map(([week, applications]) => ({
    week,
    applications,
  }));

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (currentUser?.id) {
          const data = await getApplicationsByUser(currentUser.id);
          setUserApplications(data); // Should contain job populated via backend
        }
      } catch (error) {
        console.error("Failed to load applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [currentUser?.id]);

  if (loading) return <div>Loading...</div>;
  return (
    <div className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Job Seeker Dashboard</h1>
        <p className="text-gray-500">Welcome back, {currentUser?.name}</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } p-6 rounded-lg shadow-md`}
        >
          <h3 className="text-lg font-semibold mb-2">Total Applications</h3>
          <p className="text-3xl font-bold text-blue-600">
            {userApplications.length}
          </p>
        </div>
        <div
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } p-6 rounded-lg shadow-md`}
        >
          <h3 className="text-lg font-semibold mb-2">Under Review</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {userApplications.filter((app) => app.status === "pending").length}
          </p>
        </div>
        <div
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } p-6 rounded-lg shadow-md`}
        >
          <h3 className="text-lg font-semibold mb-2">Accepted</h3>
          <p className="text-3xl font-bold text-green-600">
            {userApplications.filter((app) => app.status === "accepted").length}
          </p>
        </div>
        <div
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } p-6 rounded-lg shadow-md`}
        >
          <h3 className="text-lg font-semibold mb-2">Rejected</h3>
          <p className="text-3xl font-bold text-red-600">
            {userApplications.filter((app) => app.status === "rejected").length}
          </p>
        </div>
      </div>

      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } p-6 rounded-lg shadow-md mb-8`}
      >
        <h2 className="text-xl font-bold mb-4">Application Activity</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="applications"
                stroke="#3B82F6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow-md`}
      >
        <h2 className="text-xl font-bold p-6 border-b border-gray-200">
          Application History
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
              <tr>
                <th className="px-6 py-3 text-left">Job Title</th>
                <th className="px-6 py-3 text-left">Company</th>
                <th className="px-6 py-3 text-left">Applied Date</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {userApplications.map((app) => {
                // const job = userApplications.find(j => j._id === app.jobId);
                return (
                  <tr
                    key={app.id}
                    className={`${
                      isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4">{app?.job?.title}</td>
                    <td className="px-6 py-4">{app?.job?.company}</td>
                    <td className="px-6 py-4">
                      {new Date(app.appliedDate).toISOString().split("T")[0]}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          app.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : app.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {app.status.charAt(0).toUpperCase() +
                          app.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default JobSeekerDashboard;
