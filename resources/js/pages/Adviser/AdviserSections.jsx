import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import echo from "../../echo";
import AdviserLayout from '../../components/AdviserLayout';
export default function AdviserSections() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [sections, setSections] = useState([]);
  const [loadingSections, setLoadingSections] = useState(true);

  // 🔁 Fetch sections assigned to this adviser
  const fetchSections = async () => {
    setLoadingSections(true);
    try {
      const res = await axios.get("http://shs-portal.test/api/adviser/sections", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSections(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching sections:", error);
      setSections([]);
    } finally {
      setLoadingSections(false);
    }
  };

  // ✅ Auth + Echo subscription
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const res = await axios.get("http://shs-portal.test/api/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        localStorage.setItem("user", JSON.stringify(res.data));
        setUser(res.data);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
      }
    };

    checkUserStatus();
  }, [navigate]);

  useEffect(() => {
    fetchSections();

    if (user?.id) {
      const channel = echo.private(`adviser.${user.id}`);

      channel.listen(".SectionAssigned", (event) => {
        console.log("📦 Received new section:", event.section);
        setSections((prev) => {
          const exists = prev.some((s) => s.id === event.section.id);
          return exists ? prev : [...prev, event.section];
        });
      });

      return () => {
        echo.leave(`adviser.${user.id}`);
      };
    }
  }, [user]);

  return (
    <AdviserLayout>
      <div className="container-fluid">
        <h2 className="mb-3 fw-bold text-danger">Assigned Sections</h2>
        <p className="lead text-muted">
          These are the sections currently assigned to you.
        </p>

        {loadingSections ? (
          <div className="text-center w-100 py-5">
            <div className="spinner-border text-primary" role="status" />
          </div>
        ) : sections.length === 0 ? (
          <div className="alert alert-info">No sections assigned yet.</div>
        ) : (
          <div className="row mt-3">
            {sections.map((section, index) => (
              <div className="col-md-4 mb-3" key={index}>
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title">{section.section_name}</h5>
                    <p className="card-text">
                      <strong>Grade:</strong> {section.grade_level}
                      <br />
                      <strong>Strand:</strong> {section.strand}
                    </p>
                    <button
                      className="btn btn-danger"
                      onClick={() => navigate(`/adviser/section/${section.id}`)}
                    >
                      Manage Section
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdviserLayout>
  );
}
