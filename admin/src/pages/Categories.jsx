import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaSearch,
  FaPlus,
  FaChevronDown,
  FaChevronUp,
  FaEdit,
} from "react-icons/fa";
import { TbLayoutNavbarExpand } from "react-icons/tb";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

const CategoryManagement = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategoryID, setNewCategoryID] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubcategories, setNewSubcategories] = useState([{ id: "", name: "" }]);

  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editSubcategories, setEditSubcategories] = useState([]);
  const [editNavbarActive, setEditNavbarActive] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);

  const BASE_URL = "https://toyshop-sooty.vercel.app/api/categories";

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL}`);
      console.log("GET Categories Response:", response.data);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error.response || error);
      toast.error("Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const results = categories.filter((category) =>
      category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(results);
  }, [searchTerm, categories]);

  const resetAllForms = () => {
    setSidebarOpen(false);
    setNewCategoryID("");
    setNewCategoryName("");
    setSelectedCategory("");
    setNewSubcategories([{ id: "", name: "" }]);
    setShowNewCategoryInput(false);
    setShowAddCategoryModal(false);
    setShowEditCategoryModal(false);
    setExpandedCategories({});
    setEditCategoryId(null);
    setEditCategoryName("");
    setEditSubcategories([]);
    setEditNavbarActive(false);
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setSelectedCategory(value);
    setShowNewCategoryInput(value === "add-new-category");
  };

  const handleSubcategoryChange = (index, field, value) => {
    setNewSubcategories((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addSubcategoryField = () => {
    setNewSubcategories((prev) => [...prev, { id: "", name: "" }]);
  };

  const removeSubcategoryField = (index) => {
    setNewSubcategories((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      if (showNewCategoryInput) {
        const payload = {
          categoryID: newCategoryID,
          categoryName: newCategoryName,
          isRemoteControl: false,
          subcategories: newSubcategories
            .filter((sub) => sub.name.trim() !== "" && sub.id.trim() !== "")
            .map((sub) => ({
              subcategoryID: sub.id,
              subcategoryName: sub.name,
              products: [],
            })),
        };
        const response = await axios.post(`${BASE_URL}/add`, payload, { headers });
        console.log("POST Category Response:", response.data);
        toast.success("Category added successfully");
      } else {
        const payload = {
          subcategoryID: newSubcategories[0].id,
          subcategoryName: newSubcategories[0].name,
        };
        const response = await axios.post(
          `${BASE_URL}/add-subcategory/${selectedCategory}`,
          payload,
          { headers }
        );
        console.log("POST Subcategory Response:", response.data);
        toast.success("Subcategory added successfully");
      }

      fetchCategories();
      resetAllForms();
    } catch (error) {
      console.error("Error adding category/subcategory:", error.response || error);
      toast.error(error.response?.data?.message || "Failed to add category/subcategory");
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddCategoryModal = () => {
    setSidebarOpen(true);
    setShowAddCategoryModal(true);
    setShowEditCategoryModal(false);
    setSelectedCategory("");
    setShowNewCategoryInput(true);
  };

  const handleCloseAddCategoryModal = () => {
    resetAllForms();
  };

  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategories((prevExpanded) => ({
      ...prevExpanded,
      [categoryId]: !prevExpanded[categoryId],
    }));
  };

  const handleEditCategory = (categoryId) => {
    const categoryToEdit = categories.find((cat) => cat.categoryID === categoryId);
    if (categoryToEdit) {
      setSidebarOpen(true);
      setEditCategoryId(categoryId);
      setEditCategoryName(categoryToEdit.categoryName);
      setEditSubcategories(
        categoryToEdit.subcategories.map((sub) => ({
          id: sub.subcategoryID,
          name: sub.subcategoryName,
        }))
      );
      setEditNavbarActive(categoryToEdit.isRemoteControl);
      setShowAddCategoryModal(false);
      setShowEditCategoryModal(true);
    }
  };

  const handleCloseEditCategoryModal = () => {
    resetAllForms();
  };

  const handleEditSubcategoryChange = (index, field, value) => {
    setEditSubcategories((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addEditSubcategoryField = () => {
    setEditSubcategories((prev) => [...prev, { id: "", name: "" }]);
  };

  const removeEditSubcategoryField = (index) => {
    setEditSubcategories((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Update category details
      const categoryPayload = {
        categoryName: editCategoryName,
        isRemoteControl: editNavbarActive,
      };
      const categoryResponse = await axios.put(
        `${BASE_URL}/update/${editCategoryId}`,
        categoryPayload,
        { headers }
      );
      console.log("PUT Category Response:", categoryResponse.data);
      toast.success("Category updated successfully");

      // Get original subcategories for comparison
      const originalCategory = categories.find((cat) => cat.categoryID === editCategoryId);
      const originalSubcategories = originalCategory.subcategories;

      // Handle subcategory updates, additions, and deletions
      const currentSubcategoryIds = editSubcategories
        .filter((sub) => sub.id.trim() !== "")
        .map((sub) => sub.id);
      const originalSubcategoryIds = originalSubcategories.map((sub) => sub.subcategoryID);

      // Delete removed subcategories
      const subcategoriesToDelete = originalSubcategories.filter(
        (sub) => !currentSubcategoryIds.includes(sub.subcategoryID)
      );
      for (const sub of subcategoriesToDelete) {
        const deleteResponse = await axios.delete(
          `${BASE_URL}/delete-subcategory/${editCategoryId}/${sub.subcategoryID}`,
          { headers }
        );
        console.log(`DELETE Subcategory ${sub.subcategoryID} Response:`, deleteResponse.data);
        toast.success(`Subcategory ${sub.subcategoryName} deleted`);
      }

      // Update or add subcategories
      for (const sub of editSubcategories) {
        if (sub.id && sub.name.trim() !== "") {
          const existingSub = originalSubcategories.find((s) => s.subcategoryID === sub.id);
          if (existingSub) {
            if (existingSub.subcategoryName !== sub.name) {
              // Update existing subcategory
              const subPayload = {
                subcategoryName: sub.name,
              };
              const subResponse = await axios.put(
                `${BASE_URL}/update-subcategory/${editCategoryId}/${sub.id}`,
                subPayload,
                { headers }
              );
              console.log(`PUT Subcategory ${sub.id} Response:`, subResponse.data);
            }
          } else {
            // Add new subcategory
            const subPayload = {
              subcategoryID: sub.id,
              subcategoryName: sub.name,
            };
            const subResponse = await axios.post(
              `${BASE_URL}/add-subcategory/${editCategoryId}`,
              subPayload,
              { headers }
            );
            console.log(`POST New Subcategory ${sub.id} Response:`, subResponse.data);
          }
        }
      }

      fetchCategories();
      handleCloseEditCategoryModal();
    } catch (error) {
      console.error("Error updating category:", error.response || error);
      toast.error(error.response?.data?.message || "Failed to update category");
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDeleteClick = (categoryId) => {
    setEditCategoryId(categoryId);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.delete(`${BASE_URL}/delete/${editCategoryId}`, {
        headers,
      });
      console.log("DELETE Category Response:", response.data);
      toast.success("Category deleted successfully");

      fetchCategories();
      setShowDeleteConfirmation(false);
      setEditCategoryId(null);
    } catch (error) {
      console.error("Error deleting category:", error.response || error);
      toast.error(error.response?.data?.message || "Failed to delete category");
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setEditCategoryId(null);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 bg-gray-100">
      <div className="w-full mx-auto bg-white shadow-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">
            Manage Categories
          </h1>

          <div className="flex items-center gap-4">
            <div className="">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search categories..."
                  className="input border p-3 w-full pr-10 rounded-none"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
              </div>
            </div>
            {!showAddCategoryModal ? (
              <button
                className="flex items-center bg-yellow-400 text-white py-3 px-4 hover:bg-yellow-500 transition"
                onClick={handleOpenAddCategoryModal}
              >
                <FaPlus className="mr-2" /> Add Category
              </button>
            ) : (
              <button
                className="flex items-center bg-gray-600 text-white py-3 px-6 hover:bg-gray-700 transition"
                onClick={handleCloseAddCategoryModal}
              >
                <b> ✕ </b>   Close
              </button>
            )}
          </div>
        </div>

        <div className="w-full flex gap-4">
          <div className={`${sidebarOpen ? "w-1/2" : "w-full"} `}>
            <div className="p-4">
              <ul className="flex flex-wrap">
                {filteredCategories.length === 0 ? (
                  <p className="text-gray-500 text-center w-full mt-5">
                    No categories found
                  </p>
                ) : (
                  filteredCategories.map((category) => (
                    <li
                      key={category.categoryID}
                      className={`mb-2 p-2 ${sidebarOpen ? "w-1/2" : "w-1/3"} `}
                    >
                      <div className="bg-white border border-gray-300 p-4 ">
                        <div
                          className="flex justify-between text-lg font-bold mb-3 text-gray-800 cursor-pointer"
                          onClick={() => toggleCategoryExpansion(category.categoryID)}
                        >
                          <span>{category.categoryName} ({category.categoryID})</span>
                          <div className="flex items-center">
                            {category.isRemoteControl && (
                              <TbLayoutNavbarExpand className="mx-2 bg-green-500 rounded-md p-1" />
                            )}
                            {expandedCategories[category.categoryID] ? (
                              <FaChevronUp className="ml-2" />
                            ) : (
                              <FaChevronDown className="ml-2" />
                            )}
                          </div>
                        </div>
                        {expandedCategories[category.categoryID] && (
                          <div>
                            <ul className="pl-10 mt-2 list-disc">
                              {category.subcategories.map((subcategory, index) => (
                                <li
                                  key={index}
                                  className="text-base text-gray-600"
                                >
                                  {subcategory.subcategoryName} ({subcategory.subcategoryID})
                                </li>
                              ))}
                            </ul>
                            <div className="flex justify-end">
                              <button
                                className="flex items-center bg-yellow-400 text-white mt-3 py-2 px-6 hover:bg-yellow-500 transition"
                                onClick={() => handleEditCategory(category.categoryID)}
                              >
                                <FaEdit className="mr-2" /> Edit
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          {/* Add Category Modal */}
          {showAddCategoryModal && (
            <div className="md:w-1/2">
              <div className="flex flex-col h-full">
                <div className="bg-white p-4 border border-gray-300 mt-6 flex-grow">
                  <h2 className="text-xl font-semibold mb-4">
                    Add New Category
                  </h2>
                  <form onSubmit={handleSubmit}>
                    <div>
                      <div>
                        <label className="label">
                          <span className="label-text">Category ID</span>
                        </label>
                        <input
                          type="text"
                          className="input border p-3 w-full rounded-none"
                          placeholder="e.g., cat01"
                          value={newCategoryID}
                          onChange={(e) => setNewCategoryID(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="label">
                          <span className="label-text">Category Name</span>
                        </label>
                        <input
                          type="text"
                          className="input border p-3 w-full rounded-none"
                          placeholder="New Category Name"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          required
                        />
                      </div>

                      <label className="label">
                        <span className="label-text">Subcategories</span>
                      </label>
                      {newSubcategories.map((subcategory, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            placeholder="Subcategory ID (e.g., sub01)"
                            className="input border p-3 w-1/3 rounded-none"
                            value={subcategory.id}
                            onChange={(e) =>
                              handleSubcategoryChange(index, "id", e.target.value)
                            }
                          />
                          <input
                            type="text"
                            placeholder="Subcategory Name"
                            className="input border p-3 w-2/3 rounded-none"
                            value={subcategory.name}
                            onChange={(e) =>
                              handleSubcategoryChange(index, "name", e.target.value)
                            }
                          />
                          <button
                            type="button"
                            className="btn btn-error bg-red-400 hover:bg-red-500 px-3 text-white rounded-none"
                            onClick={() => removeSubcategoryField(index)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        className="bg-yellow-400 hover:bg-yellow-500 text-white py-3 mt-2 w-full rounded-none"
                        onClick={addSubcategoryField}
                      >
                        Add More Subcategories
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="btn bg-green-400 hover:bg-green-500 py-3 px-6 float-end text-white mt-2 rounded-none"
                    >
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Edit Category Modal */}
          {showEditCategoryModal && (
            <div className="md:w-1/2">
              <div className="flex flex-col h-full">
                <div className="bg-white p-4 border border-gray-300 mt-6 flex-grow">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Edit Category</h2>
                    <button
                      className="btn btn-sm btn-circle py-1 px-2 bg-gray-500 text-white"
                      style={{ borderRadius: "50%" }}
                      onClick={handleCloseEditCategoryModal}
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleEditSubmit}>
                    <div className="form-control mb-4">
                      <label className="label">
                        <span className="label-text">Category ID</span>
                      </label>
                      <input
                        type="text"
                        className="input border p-3 w-full rounded-none"
                        value={editCategoryId}
                        disabled
                      />
                    </div>
                    <div className="form-control mb-4">
                      <label className="label">
                        <span className="label-text">Category Name</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Category Name"
                        className="input border p-3 w-full rounded-none"
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-control mb-4">
                      <label className="label">
                        <span className="label-text">Subcategories</span>
                      </label>
                      {editSubcategories.map((subcategory, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            placeholder="Subcategory ID"
                            className="input border p-3 w-1/3 rounded-none"
                            value={subcategory.id}
                            onChange={(e) =>
                              handleEditSubcategoryChange(index, "id", e.target.value)
                            }
                          />
                          <input
                            type="text"
                            placeholder="Subcategory Name"
                            className="input border p-3 w-2/3 rounded-none"
                            value={subcategory.name}
                            onChange={(e) =>
                              handleEditSubcategoryChange(index, "name", e.target.value)
                            }
                          />
                          <button
                            type="button"
                            className="btn btn-error bg-red-400 hover:bg-red-500 px-3 text-white rounded-none"
                            onClick={() => removeEditSubcategoryField(index)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn bg-yellow-400 hover:bg-yellow-500 py-3 text-white mt-2 w-full rounded-none"
                        onClick={addEditSubcategoryField}
                      >
                        Add More Subcategories
                      </button>
                      <button
                        type="button"
                        className="btn bg-red-400 hover:bg-red-500 py-3 text-white mt-2 w-full rounded-none"
                        onClick={() => handleDeleteClick(editCategoryId)}
                      >
                        Remove Category
                      </button>
                      <div>
                        <input
                          type="checkbox"
                          className="mr-2 mt-3"
                          id="editNavbarActive"
                          checked={editNavbarActive}
                          onChange={(e) => setEditNavbarActive(e.target.checked)}
                        />
                        <label htmlFor="editNavbarActive">Show in Navbar</label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn bg-yellow-400 hover:bg-yellow-500 py-3 px-4 text-white mt-2 float-end rounded-none"
                    >
                      Save Changes
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation Modal */}
          {showDeleteConfirmation && (
            <div className="fixed top-0 left-0 z-50 inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 shadow-lg">
                <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                <p>Are you sure you want to delete this category?</p>
                <h2 className="text-lg text-center font-bold mb-4">
                  {editCategoryName} ({editCategoryId})
                </h2>
                <div className="flex justify-end mt-4">
                  <button
                    className="bg-gray-500 text-white px-4 py-3 mr-2 hover:bg-gray-600"
                    onClick={cancelDelete}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-red-400 text-white px-4 py-3 hover:bg-red-500"
                    onClick={confirmDelete}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;