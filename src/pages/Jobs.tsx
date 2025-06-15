import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Building2,
  Pencil,
  Trash2,
  Clock,
  Plus,
} from "lucide-react";
import { useStore } from "../store";
import { addJob } from "../api/addJob";
import { updateJob } from "../api/updateJob";
import { deleteJob } from "../api/deleteJob";
import Notiflix from "notiflix";
import { Job } from "../types";
const BASE_URL = import.meta.env.VITE_API_URL;


function Jobs() {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const currentUser = useStore((state) => state.currentUser);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJob, setFilteredJob] = useState([]);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [showForm, setShowForm] = useState(false);
  console.log("filteredJob", filteredJob);
  const formRef = useRef<HTMLFormElement | null>(null);

  console.log("");

  const initialJobState: Job = {
    _id: "",
    title: "",
    company: "",
    location: "",
    type: "",
    category: "",
    salary: "",
    description: "",
    requirements: [],
    postedDate: "",
  };

  Notiflix.Confirm.init({
    titleColor: "#DC2626", // Tailwind red-600
    okButtonBackground: "#DC2626", // Red "Yes" button
    okButtonColor: "#fff",
    cancelButtonBackground: "#E5E7EB", // Tailwind gray-200
    cancelButtonColor: "#000",
  });

  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    category: "",
    salary: "",
    description: "",
    requirements: [] as string[],
    postedDate: "", // or "Today"
  });

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(jobs.map((job) => job.category))];

  const handleSaveJob = async () => {
    try {
      if (editingJob) {
        const updated = await updateJob(editingJob._id, newJob);
        setJobs(jobs.map((j) => (j._id === updated._id ? updated : j)));
        Notiflix.Notify.success("Job updated successfully!");
      } else {
        const saved = await addJob(newJob);
        setJobs([...jobs, saved]);
        Notiflix.Notify.success("Job added successfully!");
      }
      // Reset form state
      setShowForm(false);
      setNewJob(initialJobState);
      setEditingJob(null);
    } catch (err) {
      Notiflix.Notify.failure("Failed to save job.");
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${BASE_URL}/job/getjob`);
        const data = await res.json();
        setJobs(data);
        setFilteredJob(data);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Find Your Next Opportunity</h1>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div
              className={`flex items-center ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg p-2 shadow-md`}
            >
              <Search className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full bg-transparent focus:outline-none ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              />
            </div>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`p-2 rounded-lg ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            } shadow-md`}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Add Job Form */}
        {currentUser?.role === "employer" && !showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 flex items-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Job
          </button>
        ) : currentUser?.role === "employer" && showForm ? (
          <form
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveJob();
              setShowForm(false);
            }}
          >
            <div className="grid gap-4 mb-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* All your form inputs unchanged */}
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Title"
                    value={newJob.title}
                    onChange={(e) =>
                      setNewJob({ ...newJob, title: e.target.value })
                    }
                    required
                    className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    placeholder="Company"
                    value={newJob.company}
                    onChange={(e) =>
                      setNewJob({ ...newJob, company: e.target.value })
                    }
                    required
                    className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Location"
                    value={newJob.location}
                    onChange={(e) =>
                      setNewJob({ ...newJob, location: e.target.value })
                    }
                    required
                    className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="Category"
                    value={newJob.category}
                    onChange={(e) =>
                      setNewJob({ ...newJob, category: e.target.value })
                    }
                    required
                    className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Job Type
                  </label>
                  <select
                    value={newJob.type}
                    onChange={(e) =>
                      setNewJob({ ...newJob, type: e.target.value })
                    }
                    className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                {/* Salary */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Salary
                  </label>
                  <input
                    type="text"
                    placeholder="Salary"
                    value={newJob.salary}
                    onChange={(e) =>
                      setNewJob({ ...newJob, salary: e.target.value })
                    }
                    required
                    className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {/* Description */}
                <div className="col-span-full">
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    placeholder="Job description..."
                    value={newJob.description}
                    onChange={(e) =>
                      setNewJob({ ...newJob, description: e.target.value })
                    }
                    required
                    className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Requirements */}
                <div className="col-span-full">
                  <label className="block text-sm font-medium mb-1">
                    Requirements
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. React, TypeScript, Redux"
                    value={newJob.requirements.join(", ")}
                    onChange={(e) =>
                      setNewJob({
                        ...newJob,
                        requirements: e.target.value
                          .split(",")
                          .map((r) => r.trim()),
                      })
                    }
                    required
                    className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500"
                  />

                  <p className="text-sm text-gray-500 mt-1">
                    Separate requirements with commas
                  </p>
                </div>

                {/* Posted Date */}
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={newJob.postedDate}
                    onChange={(e) =>
                      setNewJob({ ...newJob, postedDate: e.target.value })
                    }
                    required
                    className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Submit & Cancel */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="mt-4 flex items-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {/* Add Job */}
                  {editingJob ? "Update Job" : "Add Job"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="mt-4 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        ) : null}
      </div>

      {/* Job Cards */}
      <div className="grid gap-6">
        {filteredJobs.map((job) => (
          <div
            key={job._id}
            className={`${
              isDarkMode
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-white hover:bg-gray-50"
            } p-6 rounded-lg shadow-md transition relative`}
          >
            <Link to={`/jobs/${job._id}`} className="block">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                  <div className="flex items-center text-gray-500 mb-2">
                    <Building2 className="w-4 h-4 mr-1" />
                    <span className="mr-4">{job.company}</span>
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      {job.type}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      {job.category}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-blue-600">
                    {job.salary}
                  </div>
                  <div className="flex items-center text-gray-500 mt-2">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">Posted {job.postedDate}</span>
                  </div>
                </div>
              </div>
            </Link>
            <div className="flex justify-between items-center gap-2">
              <div>
                  {currentUser?.role === "employer" && (
                   <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingJob(job);
                    setNewJob(job);
                    setShowForm(true);

                    setTimeout(() => {
                      formRef.current?.scrollIntoView({ behavior: "smooth" });
                    }, 100); // delay needed to wait for the form to mount
                  }}
                  className="text-green-500 hover:text-green-700 mr-2 mt-4"
                >
                  <Pencil size={20} />
                </button>
                )}
              </div>
              <div className="flex justify-end">
                {currentUser?.role === "employer" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      Notiflix.Confirm.show(
                        "Confirm Delete",
                        "Are you sure you want to delete this job?",
                        "Yes",
                        "No",
                        async () => {
                          try {
                            await deleteJob(job._id);
                            setJobs(jobs.filter((j) => j._id !== job._id));
                            Notiflix.Notify.success(
                              "Job deleted successfully!"
                            );
                          } catch (err) {
                            Notiflix.Notify.failure("Failed to delete job.");
                          }
                        },
                        () => {
                          // Cancel callback – do nothing
                        }
                      );
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Jobs;
