// import { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import axios from "axios";
// import { toast } from "react-toastify";
// import Stepper from "../components/Stepper";
// import { ShopContext } from "../context/ShopContext";
// import LoadingSpinner from "../components/LoadingSpinner";

// const AddProducts = () => {
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);
//   const { fetchProducts, currency } = useContext(ShopContext);
//   const [step, setStep] = useState(1);
//   const [productImages, setProductImages] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("");

//   const notifySuccess = () => toast.success("Product Added Successfully");
//   const notifyError = (error) => toast.error("Error Adding Product: " + error);

//   const allowedFileTypes = [
//     "image/jpeg",
//     "image/png",
//     "image/jpg",
//     "image/webp",
//     "image/avif",
//     "image/gif",
//     "image/bmp",
//     "image/tiff",
//     "image/x-icon",
//     "image/svg+xml",
//   ];

//   const steps = [
//     { name: "Basic Info & Details", icon: "1" },
//     { name: "Images", icon: "2" },
//   ];

//   const validationSchema = Yup.object({
//     name: Yup.string().required("Product Name is required"),
//     description: Yup.string().required("Description is required"),
//     price: Yup.number()
//       .required("Price is required")
//       .positive("Price must be positive"),
//     stock: Yup.number()
//       .required("Stock is required")
//       .integer("Stock must be an integer")
//       .min(0, "Stock cannot be negative"),
//     categoryID: Yup.string().required("Category ID is required"),
//     subcategoryID: Yup.string().required("Subcategory ID is required"),
//     materialType: Yup.string().required("Material Type is required"),
//     productType: Yup.array()
//       .of(Yup.string())
//       .min(1, "At least one product type is required"),
//     images: Yup.array()
//       .min(1, "At least one image is required")
//       .required("Images are required"),
//   });

//   // Fetch categories from API
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         setIsLoading(true);
//         const response = await axios.get("https://toyshop-sooty.vercel.app/api/categories/");
//         setCategories(response.data);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//         notifyError("Failed to load categories.");
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchCategories();
//   }, []);

//   const getStepFields = (step) => {
//     switch (step) {
//       case 1:
//         return [
//           "name",
//           "description",
//           "price",
//           "stock",
//           "categoryID",
//           "subcategoryID",
//           "materialType",
//           "productType",
//         ];
//       case 2:
//         return ["images"];
//       default:
//         return [];
//     }
//   };

//   const handleImageChange = (e, setFieldValue) => {
//     const files = Array.from(e.target.files);
//     const invalidFiles = files.filter(
//       (file) => !allowedFileTypes.includes(file.type)
//     );
//     if (invalidFiles.length > 0) {
//       toast.error(
//         "Invalid file type detected. Allowed: JPG, PNG, JPEG, WebP, AVIF, GIF, BMP, TIFF, ICO, SVG."
//       );
//       return;
//     }

//     const newImagePreviews = files.map((file) => URL.createObjectURL(file));
//     setProductImages((prev) => [...prev, ...newImagePreviews]);
//     setFieldValue("images", files);
//   };

//   const removeImage = (index, setFieldValue) => {
//     const updatedImages = productImages.filter((_, i) => i !== index);
//     const updatedFiles = values.images.filter((_, i) => i !== index);
//     setProductImages(updatedImages);
//     setFieldValue("images", updatedFiles);
//   };

//   const handleSubmit = async (values) => {
//     try {
//       setIsLoading(true);
//       const formData = new FormData();
//       formData.append("name", values.name.trim());
//       formData.append("description", values.description);
//       formData.append("price", values.price);
//       formData.append("stock", values.stock);
//       formData.append("categoryID", values.categoryID);
//       formData.append("subcategoryID", values.subcategoryID);
//       formData.append("materialType", values.materialType);
//       values.productType.forEach((type) => formData.append("productType", type));
//       values.images.forEach((file) => formData.append("images", file));

//       const response = await axios.post(
//         "https://toyshop-sooty.vercel.app/api/products",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       console.log("Response from API:", response.data);
//       fetchProducts();
//       notifySuccess();
//       navigate("/products");
//     } catch (error) {
//       console.error("Error adding product:", error);
//       if (error.response) {
//         console.log("Backend Error Response:", error.response.data);
//         notifyError(error.response.data.message || "Failed to add product.");
//       } else {
//         notifyError("Network error or server is unreachable.");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isLoading) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div className="p-8 bg-gray-100">
//       <div className="mx-auto bg-white shadow-md p-6">
//         <h1 className="text-3xl font-semibold text-gray-800 mb-6">
//           Add New Toy Product
//         </h1>
//         <Stepper steps={steps} currentStep={step - 1} />
//         <Formik
//           initialValues={{
//             name: "",
//             description: "",
//             price: "",
//             stock: "",
//             categoryID: "",
//             subcategoryID: "",
//             materialType: "",
//             productType: [],
//             images: [],
//           }}
//           validationSchema={validationSchema}
//           onSubmit={(values) => handleSubmit(values)}
//         >
//           {({ values, setFieldValue, errors, touched, validateForm }) => (
//             <Form className="space-y-6">
//               {/* Step 1: Basic Info & Details */}
//               {step === 1 && (
//                 <>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-gray-600 font-medium">
//                         Product Name
//                       </label>
//                       <Field
//                         type="text"
//                         name="name"
//                         className="w-full p-3 border"
//                       />
//                       <ErrorMessage
//                         name="name"
//                         component="div"
//                         className="text-red-500 text-sm"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-gray-600 font-medium">
//                         Price ({currency})
//                       </label>
//                       <Field
//                         type="number"
//                         name="price"
//                         className="w-full p-3 border"
//                       />
//                       <ErrorMessage
//                         name="price"
//                         component="div"
//                         className="text-red-500 text-sm"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-gray-600 font-medium">
//                         Stock
//                       </label>
//                       <Field
//                         type="number"
//                         name="stock"
//                         className="w-full p-3 border"
//                       />
//                       <ErrorMessage
//                         name="stock"
//                         component="div"
//                         className="text-red-500 text-sm"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-gray-600 font-medium">
//                         Category ID
//                       </label>
//                       <Field
//                         as="select"
//                         name="categoryID"
//                         className="w-full p-3 border"
//                         onChange={(e) => {
//                           const value = e.target.value;
//                           setFieldValue("categoryID", value);
//                           setSelectedCategory(value);
//                           setFieldValue("subcategoryID", ""); // Reset subcategory when category changes
//                         }}
//                       >
//                         <option value="">Select Category</option>
//                         {categories.map((category) => (
//                           <option key={category.categoryID} value={category.categoryID}>
//                             {category.categoryName} ({category.categoryID})
//                           </option>
//                         ))}
//                       </Field>
//                       <ErrorMessage
//                         name="categoryID"
//                         component="div"
//                         className="text-red-500 text-sm"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-gray-600 font-medium">
//                         Subcategory ID
//                       </label>
//                       <Field
//                         as="select"
//                         name="subcategoryID"
//                         className="w-full p-3 border"
//                         disabled={!selectedCategory}
//                       >
//                         <option value="">Select Subcategory</option>
//                         {selectedCategory &&
//                           categories
//                             .find((cat) => cat.categoryID === selectedCategory)
//                             ?.subcategories.map((sub) => (
//                               <option key={sub.subcategoryID} value={sub.subcategoryID}>
//                                 {sub.subcategoryName} ({sub.subcategoryID})
//                               </option>
//                             ))}
//                       </Field>
//                       <ErrorMessage
//                         name="subcategoryID"
//                         component="div"
//                         className="text-red-500 text-sm"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-gray-600 font-medium">
//                         Material Type
//                       </label>
//                       <Field
//                         type="text"
//                         name="materialType"
//                         className="w-full p-3 border"
//                       />
//                       <ErrorMessage
//                         name="materialType"
//                         component="div"
//                         className="text-red-500 text-sm"
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-gray-600 font-medium">
//                       Description
//                     </label>
//                     <Field
//                       as="textarea"
//                       name="description"
//                       className="w-full p-3 border h-32 resize-y"
//                     />
//                     <ErrorMessage
//                       name="description"
//                       component="div"
//                       className="text-red-500 text-sm"
//                     />
//                   </div>
//                   <FieldArray name="productType">
//                     {({ push, remove }) => (
//                       <div>
//                         <label className="block text-gray-600 font-medium">
//                           Product Types
//                         </label>
//                         {values.productType.map((type, index) => (
//                           <div
//                             key={index}
//                             className="flex items-center gap-4 mb-2"
//                           >
//                             <Field
//                               type="text"
//                               name={`productType.${index}`}
//                               className="w-full p-3 border"
//                             />
//                             {index > 0 && (
//                               <button
//                                 type="button"
//                                 onClick={() => remove(index)}
//                                 className="bg-red-400 hover:bg-red-500 text-white px-3 py-1"
//                               >
//                                 Remove
//                               </button>
//                             )}
//                           </div>
//                         ))}
//                         <button
//                           type="button"
//                           onClick={() => push("")}
//                           className="bg-green-400 hover:bg-green-500 text-white px-4 py-3"
//                         >
//                           + Add Product Type
//                         </button>
//                         <ErrorMessage
//                           name="productType"
//                           component="div"
//                           className="text-red-500 text-sm"
//                         />
//                       </div>
//                     )}
//                   </FieldArray>
//                 </>
//               )}

//               {/* Step 2: Images */}
//               {step === 2 && (
//                 <>
//                   <label className="block text-gray-600 font-medium">
//                     Product Images
//                   </label>
//                   <div className="flex flex-wrap gap-4 mt-2">
//                     <label
//                       htmlFor="images"
//                       className="w-24 h-24 border flex items-center justify-center cursor-pointer"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         strokeWidth={1.5}
//                         stroke="currentColor"
//                         className="size-6"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
//                         />
//                       </svg>
//                       <input
//                         type="file"
//                         id="images"
//                         onChange={(e) => handleImageChange(e, setFieldValue)}
//                         accept="image/*"
//                         multiple
//                         hidden
//                       />
//                     </label>
//                     {productImages.map((image, index) => (
//                       <div key={index} className="relative">
//                         <img
//                           src={image}
//                           alt="Product Preview"
//                           className="w-24 h-24 object-cover border"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => removeImage(index, setFieldValue)}
//                           className="absolute top-1 right-1 bg-red-400 text-white text-xs px-2 py-1 rounded-full"
//                         >
//                           X
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                   <ErrorMessage
//                     name="images"
//                     component="div"
//                     className="text-red-500 text-sm"
//                   />
//                 </>
//               )}

//               {/* Navigation Buttons */}
//               <div className="w-full mt-6 flex justify-between">
//                 {step > 1 && (
//                   <button
//                     type="button"
//                     onClick={() => setStep(step - 1)}
//                     className="bg-gray-500 text-white px-8 py-3"
//                   >
//                     Back
//                   </button>
//                 )}
//                 {step === 1 && (
//                   <button
//                     type="button"
//                     onClick={async () => {
//                       const errors = await validateForm();
//                       const currentStepFields = getStepFields(step);
//                       const hasErrors = currentStepFields.some(
//                         (field) => errors[field]
//                       );
//                       if (hasErrors) {
//                         Object.keys(errors).forEach((key) =>
//                           setFieldValue(key, values[key], true)
//                         );
//                       } else {
//                         setStep(2);
//                       }
//                     }}
//                     className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-3"
//                   >
//                     Next
//                   </button>
//                 )}
//                 {step === 2 && (
//                   <button
//                     type="submit"
//                     className="bg-green-400 hover:bg-green-500 text-white px-6 py-3"
//                   >
//                     Submit
//                   </button>
//                 )}
//               </div>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export default AddProducts;
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import Stepper from "../components/Stepper";
import { ShopContext } from "../context/ShopContext";
import LoadingSpinner from "../components/LoadingSpinner";

const AddProducts = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { fetchProducts, currency } = useContext(ShopContext);
  const [step, setStep] = useState(1);
  const [productImages, setProductImages] = useState([]);
  const [categories, setCategories] = useState([]);

  const notifySuccess = () => toast.success("Product Added Successfully");
  const notifyError = (error) => toast.error("Error Adding Product: " + error);

  const allowedFileTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
    "image/avif",
    "image/gif",
    "image/bmp",
    "image/tiff",
    "image/x-icon",
    "image/svg+xml",
  ];

  const steps = [
    { name: "Basic Info & Details", icon: "1" },
    { name: "Images", icon: "2" },
  ];

  const validationSchema = Yup.object({
    name: Yup.string().required("Product Name is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number()
      .required("Price is required")
      .positive("Price must be positive"),
    stock: Yup.number()
      .required("Stock is required")
      .integer("Stock must be an integer")
      .min(0, "Stock cannot be negative"),
    categorySubcategoryPairs: Yup.array()
      .of(
        Yup.object({
          categoryID: Yup.string().required("Category ID is required"),
          subcategoryID: Yup.string().required("Subcategory ID is required"),
        })
      )
      .min(1, "At least one category and subcategory pair is required"),
    materialType: Yup.string().required("Material Type is required"),
    productType: Yup.array()
      .of(Yup.string())
      .min(1, "At least one product type is required"),
    images: Yup.array()
      .min(1, "At least one image is required")
      .required("Images are required"),
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("https://toyshop-sooty.vercel.app/api/categories/");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        notifyError("Failed to load categories.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const getStepFields = (step) => {
    switch (step) {
      case 1:
        return [
          "name",
          "description",
          "price",
          "stock",
          "categorySubcategoryPairs",
          "materialType",
          "productType",
        ];
      case 2:
        return ["images"];
      default:
        return [];
    }
  };

  const handleImageChange = (e, setFieldValue) => {
    const files = Array.from(e.target.files);
    const invalidFiles = files.filter(
      (file) => !allowedFileTypes.includes(file.type)
    );
    if (invalidFiles.length > 0) {
      toast.error(
        "Invalid file type detected. Allowed: JPG, PNG, JPEG, WebP, AVIF, GIF, BMP, TIFF, ICO, SVG."
      );
      return;
    }

    const newImagePreviews = files.map((file) => URL.createObjectURL(file));
    setProductImages((prev) => [...prev, ...newImagePreviews]);
    setFieldValue("images", files);
  };

  const removeImage = (index, setFieldValue, values) => {
    const updatedImages = productImages.filter((_, i) => i !== index);
    const updatedFiles = values.images.filter((_, i) => i !== index);
    setProductImages(updatedImages);
    setFieldValue("images", updatedFiles);
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("name", values.name.trim());
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("stock", values.stock);
      formData.append("materialType", values.materialType);
      values.productType.forEach((type) => formData.append("productType", type));
      values.images.forEach((file) => formData.append("images", file));

      values.categorySubcategoryPairs.forEach((pair) => {
        formData.append("categoryID", pair.categoryID);
        formData.append("subcategoryID", pair.subcategoryID);
      });

      const response = await axios.post(
        "https://toyshop-sooty.vercel.app/api/products",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response from API:", response.data);
      fetchProducts();
      notifySuccess();
      resetForm(); // Reset form after successful submission
      navigate("/products");
    } catch (error) {
      console.error("Error adding product:", error);
      if (error.response) {
        console.log("Backend Error Response:", error.response.data);
        const errorMessage = error.response.data.error || "Failed to add product.";
        if (errorMessage.includes("E11000 duplicate key error")) {
          notifyError("A product with this name already exists. Please use a different name.");
        } else {
          notifyError(errorMessage);
        }
      } else {
        notifyError("Network error or server is unreachable.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-8 bg-gray-100">
      <div className="mx-auto bg-white shadow-md p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Add New Toy Product
        </h1>
        <Stepper steps={steps} currentStep={step - 1} />
        <Formik
          initialValues={{
            name: "",
            description: "",
            price: "",
            stock: "",
            categorySubcategoryPairs: [{ categoryID: "", subcategoryID: "" }],
            materialType: "",
            productType: [],
            images: [],
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, errors, touched, validateForm }) => (
            <Form className="space-y-6">
              {step === 1 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-600 font-medium">
                        Product Name
                      </label>
                      <Field
                        type="text"
                        name="name"
                        className="w-full p-3 border"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-medium">
                        Price ({currency})
                      </label>
                      <Field
                        type="number"
                        name="price"
                        className="w-full p-3 border"
                      />
                      <ErrorMessage
                        name="price"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-medium">
                        Stock
                      </label>
                      <Field
                        type="number"
                        name="stock"
                        className="w-full p-3 border"
                      />
                      <ErrorMessage
                        name="stock"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-medium">
                        Material Type
                      </label>
                      <Field
                        type="text"
                        name="materialType"
                        className="w-full p-3 border"
                      />
                      <ErrorMessage
                        name="materialType"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-600 font-medium">
                      Description
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      className="w-full p-3 border h-32 resize-y"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <FieldArray name="categorySubcategoryPairs">
                    {({ push, remove }) => (
                      <div>
                        <label className="block text-gray-600 font-medium">
                          Categories & Subcategories
                        </label>
                        {/* Debug log to inspect state */}
                        {console.log("categorySubcategoryPairs:", values.categorySubcategoryPairs)}
                        {Array.isArray(values.categorySubcategoryPairs) && values.categorySubcategoryPairs
                          .filter(pair => pair && typeof pair === "object") // Filter out invalid entries
                          .map((pair, index) => {
                            const selectedCategory = categories.find(
                              (cat) => cat.categoryID === pair.categoryID
                            );
                            return (
                              <div key={index} className="flex flex-col gap-4 mb-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-full">
                                    <Field
                                      as="select"
                                      name={`categorySubcategoryPairs.${index}.categoryID`}
                                      className="w-full p-3 border"
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setFieldValue(
                                          `categorySubcategoryPairs.${index}.categoryID`,
                                          value
                                        );
                                        setFieldValue(
                                          `categorySubcategoryPairs.${index}.subcategoryID`,
                                          ""
                                        );
                                      }}
                                    >
                                      <option value="">Select Category</option>
                                      {categories.map((category) => (
                                        <option
                                          key={category.categoryID}
                                          value={category.categoryID}
                                        >
                                          {category.categoryName} ({category.categoryID})
                                        </option>
                                      ))}
                                    </Field>
                                    <ErrorMessage
                                      name={`categorySubcategoryPairs.${index}.categoryID`}
                                      component="div"
                                      className="text-red-500 text-sm"
                                    />
                                  </div>
                                  <div className="w-full">
                                    <Field
                                      as="select"
                                      name={`categorySubcategoryPairs.${index}.subcategoryID`}
                                      className="w-full p-3 border"
                                      disabled={!pair.categoryID}
                                    >
                                      <option value="">Select Subcategory</option>
                                      {selectedCategory?.subcategories?.length > 0 ? (
                                        selectedCategory.subcategories.map((sub) => (
                                          <option
                                            key={sub.subcategoryID}
                                            value={sub.subcategoryID}
                                          >
                                            {sub.subcategoryName} ({sub.subcategoryID})
                                          </option>
                                        ))
                                      ) : (
                                        <option value="">No subcategories available</option>
                                      )}
                                    </Field>
                                    <ErrorMessage
                                      name={`categorySubcategoryPairs.${index}.subcategoryID`}
                                      component="div"
                                      className="text-red-500 text-sm"
                                    />
                                  </div>
                                  {index > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => remove(index)}
                                      className="bg-red-400 hover:bg-red-500 text-white px-3 py-1"
                                    >
                                      Remove
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        {errors.categorySubcategoryPairs && touched.categorySubcategoryPairs && (
                          <div className="text-red-500 text-sm">
                            {typeof errors.categorySubcategoryPairs === "string" ? (
                              errors.categorySubcategoryPairs
                            ) : (
                              errors.categorySubcategoryPairs.map((error, index) => (
                                <div key={index}>
                                  {error?.categoryID && `Pair ${index + 1}: ${error.categoryID}`}
                                  {error?.subcategoryID && `Pair ${index + 1}: ${error.subcategoryID}`}
                                </div>
                              ))
                            )}
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => push({ categoryID: "", subcategoryID: "" })}
                          className="bg-green-400 hover:bg-green-500 text-white px-4 py-3"
                        >
                          + Add Category/Subcategory
                        </button>
                      </div>
                    )}
                  </FieldArray>
                  <FieldArray name="productType">
                    {({ push, remove }) => (
                      <div>
                        <label className="block text-gray-600 font-medium">
                          Product Types
                        </label>
                        {values.productType.map((type, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 mb-2"
                          >
                            <Field
                              type="text"
                              name={`productType.${index}`}
                              className="w-full p-3 border"
                            />
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="bg-red-400 hover:bg-red-500 text-white px-3 py-1"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => push("")}
                          className="bg-green-400 hover:bg-green-500 text-white px-4 py-3"
                        >
                          + Add Product Type
                        </button>
                        <ErrorMessage
                          name="productType"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    )}
                  </FieldArray>
                </>
              )}

              {step === 2 && (
                <>
                  <label className="block text-gray-600 font-medium">
                    Product Images
                  </label>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <label
                      htmlFor="images"
                      className="w-24 h-24 border flex items-center justify-center cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
                        />
                      </svg>
                      <input
                        type="file"
                        id="images"
                        onChange={(e) => handleImageChange(e, setFieldValue)}
                        accept="image/*"
                        multiple
                        hidden
                      />
                    </label>
                    {productImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt="Product Preview"
                          className="w-24 h-24 object-cover border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index, setFieldValue, values)}
                          className="absolute top-1 right-1 bg-red-400 text-white text-xs px-2 py-1 rounded-full"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                  <ErrorMessage
                    name="images"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </>
              )}

              <div className="w-full mt-6 flex justify-between">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="bg-gray-500 text-white px-8 py-3"
                  >
                    Back
                  </button>
                )}
                {step === 1 && (
                  <button
                    type="button"
                    onClick={async () => {
                      const errors = await validateForm();
                      const currentStepFields = getStepFields(step);
                      const hasErrors = currentStepFields.some(
                        (field) => errors[field]
                      );
                      if (hasErrors) {
                        Object.keys(errors).forEach((key) =>
                          setFieldValue(key, values[key], true)
                        );
                      } else {
                        setStep(2);
                      }
                    }}
                    className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-3"
                  >
                    Next
                  </button>
                )}
                {step === 2 && (
                  <button
                    type="submit"
                    className="bg-green-400 hover:bg-green-500 text-white px-6 py-3"
                  >
                    Submit
                  </button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddProducts;