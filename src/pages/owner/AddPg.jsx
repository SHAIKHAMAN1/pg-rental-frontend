import React, { useState, useEffect } from "react";
import Title from "../../components/Title";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

const sharingMap = { single: 1, double: 2, triple: 3 };
const roomTypes = ["single", "double", "triple"];

const AddPg = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    amenities: [],
    images: [],
    isAvailable: true,
    phone: "",
    isGirlsPg: false,
    roomConfig: {
      single: { rooms: 0, price: 0 },
      double: { rooms: 0, price: 0 },
      triple: { rooms: 0, price: 0 }
    }
  });

  const amenitiesList = [
    "WiFi", "AC", "Food", "Laundry",
    "Parking", "CCTV", "Gym", "Study Room"
  ];

  /* ===============================
     FETCH PG FOR EDIT MODE
  =============================== */
  useEffect(() => {
    if (!id) return;

    const fetchPg = async () => {
      try {
        const { data } = await axios.get(`/api/user/pg/${id}`);
        if (data.success) {
          const pg = data.pg;

          setFormData({
            name: pg.name,
            location: pg.location,
            description: pg.description || "",
            amenities: pg.amenities || [],
            images: [],
            isAvailable: pg.isAvailable,
            phone: pg.phone || "",
            isGirlsPg: pg.isGirlsPg || false,
            roomConfig: pg.roomConfig
          });
        }
      } catch (error) {
        toast.error("Failed to load PG data");
      }
    };

    fetchPg();
  }, [id]);

  /* ===============================
     BASIC INPUT CHANGE
  =============================== */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  /* ===============================
     ROOM CONFIG CHANGE
  =============================== */
  const handleRoomChange = (type, field, value) => {
    setFormData((prev) => ({
      ...prev,
      roomConfig: {
        ...prev.roomConfig,
        [type]: {
          ...prev.roomConfig[type],
          [field]: Number(value)
        }
      }
    }));
  };

  /* ===============================
     AMENITIES
  =============================== */
  const handleAmenityChange = (e) => {
    const { value, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, value]
        : prev.amenities.filter((a) => a !== value)
    }));
  };

  /* ===============================
     IMAGE HANDLING
  =============================== */
  const handleFiles = (files) => {
    const newFiles = Array.from(files);

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newFiles]
    }));
  };

  const calculateBeds = (type) =>
    formData.roomConfig[type].rooms * sharingMap[type];

  /* ===============================
     SUBMIT
  =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.phone) {
      return toast.error("Phone number is required");
    }

    try {
      const pgData = {
        name: formData.name,
        location: formData.location,
        description: formData.description,
        amenities: formData.amenities,
        roomConfig: formData.roomConfig,
        isAvailable: formData.isAvailable,
        phone: formData.phone,
        isGirlsPg: formData.isGirlsPg
      };

      if (isEditMode) {
        // UPDATE MODE
        const { data } = await axios.put(
          `/api/owner/update-pg/${id}`,
          pgData
        );

        if (data.success) {
          toast.success("PG Updated Successfully");
          navigate("/owner/manage-pg");
        }
      } else {
        // ADD MODE
        const form = new FormData();
        form.append("pgData", JSON.stringify(pgData));

        formData.images.forEach((image) => {
          form.append("images", image);
        });

        const { data } = await axios.post(
          "/api/owner/add-pg",
          form
        );

        if (data.success) {
          toast.success("PG Added Successfully");
          navigate("/owner/manage-pg");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="p-10 w-full bg-gray-50 min-h-screen">
      <Title
        title={isEditMode ? "Edit PG" : "Add New PG"}
        subTitle="Configure rooms and bed availability"
        align="left"
      />

      <form
        onSubmit={handleSubmit}
        className="mt-10 bg-white rounded-2xl shadow-sm p-10 space-y-10"
      >
        <SectionTitle title="Basic Information" />

        <div className="grid md:grid-cols-2 gap-6">
          <Input label="PG Name" name="name" value={formData.name} onChange={handleChange} />
          <Input label="Location" name="location" value={formData.location} onChange={handleChange} />
        </div>

        <Input
          label="Contact Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="isGirlsPg"
            checked={formData.isGirlsPg}
            onChange={handleChange}
          />
          This is a Girls PG
        </label>

        <SectionTitle title="Room Configuration" />

        <div className="grid md:grid-cols-3 gap-6">
          {roomTypes.map((type) => (
            <div key={type} className="border rounded-xl p-6 space-y-4">
              <h4 className="font-semibold capitalize">{type} Sharing</h4>

              <Input
                label="No. of Rooms"
                type="number"
                value={formData.roomConfig[type].rooms}
                onChange={(e) =>
                  handleRoomChange(type, "rooms", e.target.value)
                }
              />

              <Input
                label="Price per Bed (₹)"
                type="number"
                value={formData.roomConfig[type].price}
                onChange={(e) =>
                  handleRoomChange(type, "price", e.target.value)
                }
              />

              <p className="text-sm text-gray-500">
                Total Beds: <span className="font-medium">
                  {calculateBeds(type)}
                </span>
              </p>
            </div>
          ))}
        </div>

        <SectionTitle title="Amenities" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {amenitiesList.map((item) => (
            <label key={item} className="flex items-center gap-2 border px-4 py-3 rounded-lg">
              <input
                type="checkbox"
                value={item}
                checked={formData.amenities.includes(item)}
                onChange={handleAmenityChange}
              />
              {item}
            </label>
          ))}
        </div>

        <SectionTitle title="Description" />

        <textarea
          name="description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="isAvailable"
            checked={formData.isAvailable}
            onChange={handleChange}
          />
          Available for Booking
        </label>

        <button
          type="submit"
          className="bg-primary text-white px-8 py-3 rounded-lg"
        >
          {isEditMode ? "Update PG" : "Add PG"}
        </button>
      </form>
    </div>
  );
};

const SectionTitle = ({ title }) => (
  <h3 className="text-lg font-semibold border-b pb-2">
    {title}
  </h3>
);

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm mb-1">{label}</label>
    <input
      {...props}
      className="w-full border rounded-lg px-4 py-2"
    />
  </div>
);

export default AddPg;