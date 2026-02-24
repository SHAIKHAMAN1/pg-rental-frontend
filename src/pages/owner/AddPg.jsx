import React, { useState } from "react";
import Title from "../../components/Title";
import axios from "axios";
import { toast } from "react-hot-toast";

const sharingMap = { single: 1, double: 2, triple: 3 };
const roomTypes = ["single", "double", "triple"];

const AddPg = () => {
  const [dragActive, setDragActive] = useState(false);

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

  /* Basic Change */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  /* Room Config Change */
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

  /* Amenities */
  const handleAmenityChange = (e) => {
    const { value, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, value]
        : prev.amenities.filter((a) => a !== value)
    }));
  };

  /* Handle Files */
  const handleFiles = (files) => {
    const newFiles = Array.from(files);

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newFiles]
    }));
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const calculateBeds = (type) =>
    formData.roomConfig[type].rooms * sharingMap[type];

  /* Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.phone) {
      return toast.error("Phone number is required");
    }

    try {
      const form = new FormData();

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

      form.append("pgData", JSON.stringify(pgData));

      formData.images.forEach((image) => {
        form.append("images", image);
      });

      const { data } = await axios.post("/api/owner/add-pg", form);

      if (data.success) {
        toast.success("PG Added Successfully");

        // Reset form
        setFormData({
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

      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="p-10 w-full bg-gray-50 min-h-screen">
      <Title
        title="Add New PG"
        subTitle="Configure rooms and bed availability"
        align="left"
      />

      <form
        onSubmit={handleSubmit}
        className="mt-10 bg-white rounded-2xl shadow-sm p-10 space-y-10"
      >
        {/* Basic Info */}
        <SectionTitle title="Basic Information" />

        <div className="grid md:grid-cols-2 gap-6">
          <Input label="PG Name" name="name" value={formData.name} onChange={handleChange} />
          <Input label="Location" name="location" value={formData.location} onChange={handleChange} />
        </div>

        {/* Phone */}
        <div className="mt-6">
          <Input
            label="Contact Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter 10 digit mobile number"
          />
        </div>

        {/* Girls PG Checkbox */}
        <div className="mt-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isGirlsPg"
              checked={formData.isGirlsPg}
              onChange={handleChange}
            />
            This is a Girls PG
          </label>
        </div>

        {/* Room Config */}
        <SectionTitle title="Room Configuration" />

        <div className="grid md:grid-cols-3 gap-6">
          {roomTypes.map((type) => (
            <div key={type} className="border rounded-xl p-6 space-y-4">
              <h4 className="font-semibold capitalize">{type} Sharing</h4>

              <Input
                label="No. of Rooms"
                type="number"
                min="0"
                value={formData.roomConfig[type].rooms}
                onChange={(e) =>
                  handleRoomChange(type, "rooms", e.target.value)
                }
              />

              <Input
                label="Price per Bed (₹)"
                type="number"
                min="0"
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

        {/* Amenities */}
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

        {/* Image Upload */}
        <SectionTitle title="Upload Images" />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {/* Description */}
        <SectionTitle title="Description" />

        <textarea
          name="description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />

        {/* Availability */}
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
          Add PG
        </button>
      </form>
    </div>
  );
};

/* Reusable Components */

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