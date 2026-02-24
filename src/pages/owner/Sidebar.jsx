import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { assets, ownerMenuLinks } from "../../assets/assets";

const Sidebar = () => {
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);

  /* =========================
     Fetch Logged-in User
  ========================= */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // ✅ Correct endpoint
        const { data } = await axios.get("/api/user/data");

        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.log("Fetch user error:", error);
      }
    };

    fetchUser();
  }, []);

  /* =========================
     Upload Profile Image
  ========================= */
  const updateImage = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    try {
      const { data } = await axios.put(
        "/api/owner/update-profile-image",
        formData
      );

      if (data.success) {
        // ✅ Keep same object structure
        setUser((prev) => ({
          ...prev,
          image: data.image
        }));
        setImage(null);
      }
    } catch (error) {
      console.log("Image update error:", error);
    }
  };

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col items-center py-8">

      {/* Profile Section */}
      <div className="relative group">

        <label htmlFor="image" className="cursor-pointer relative block">
          <img
            src={
              image
                ? URL.createObjectURL(image)
                : user?.image?.url ||
                  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=300"
            }
            alt="profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
          />

          <input
            type="file"
            id="image"
            accept="image/*"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />

          <div className="absolute hidden top-0 right-0 left-0 bottom-0 bg-black/30 rounded-full group-hover:flex items-center justify-center">
            <img src={assets.edit_icon} alt="edit" width={20} />
          </div>
        </label>

        {image && (
          <button
            onClick={updateImage}
            className="absolute top-0 right-0 flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
          >
            Save
            <img src={assets.check_icon} width={13} alt="check" />
          </button>
        )}
      </div>

      {/* Username */}
      <p className="mt-4 text-lg font-semibold">
        {user?.name || "User"}
      </p>

      {/* Navigation Links */}
      <div className="w-full mt-10">
        {ownerMenuLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={({ isActive }) =>
              `relative flex items-center gap-3 w-full py-3 pl-6 transition-all
              ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <img
                  src={isActive ? link.coloredIcon : link.icon}
                  alt="icon"
                  width={20}
                />
                <span className="text-sm">{link.name}</span>

                {isActive && (
                  <div className="absolute right-0 w-1 h-8 bg-primary rounded-l-md"></div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;