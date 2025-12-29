import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllDonors } from "../../API/Admin API/donorApi";

const ITEMS_PER_PAGE = 8;

const DonorList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const loadDonors = async () => {
      try {
        setLoading(true);
        const data = await fetchAllDonors(user.token);
        // data should be an array now thanks to API helper update
        setDonors(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching donors:", err);
        setError("❌ Failed to fetch donors.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) loadDonors();
  }, [user?.token]);

  const totalPages = Math.ceil(donors.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentDonors = donors.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="p-6 bg-white min-h-screen">
      <h2 className="text-lg font-semibold mb-4">All Donors</h2>

      {loading ? (
           <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4D9186]"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 py-10">{error}</div>
      ) : donors.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="text-lg">No Donors found.</div>
          </div>
      ) : (
        <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
        {currentDonors.map((donor, index) => (
          <div
            key={donor._id || index}
            className="bg-white shadow-sm hover:shadow-md rounded-2xl p-6 flex flex-col lg:flex-row justify-between lg:items-center gap-6 border border-gray-100 transition-all"
          >
                <div>
                  <p className="text-gray-500 text-sm">Name:</p>
                  <p className="text-[17px] font-semibold">{donor.username}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Phone Number:</p>
                  <p className="text-[17px] font-semibold">{donor.mobile}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Email:</p>
                  <p className="text-[17px] font-semibold">{donor.email || donor.mail}</p>
                </div>
            <div className="flex items-center lg:justify-center">
              <Link
                to={`/admin/total-donors/donor/${donor._id || donor.id}`}
                className="w-full lg:w-auto text-center bg-[#4D9186] text-white px-6 py-2.5 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-[#0a7a5d] transition-all shadow-md active:scale-95"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded border ${
                    currentPage === i + 1
                      ? "bg-[#4D9186] text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DonorList;

