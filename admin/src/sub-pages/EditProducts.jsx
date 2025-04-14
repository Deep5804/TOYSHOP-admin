
// import { useState, useEffect, useContext } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import axios from "axios";
// import { toast } from "react-toastify";
// import Stepper from "../components/Stepper";
// import { ShopContext } from "../context/ShopContext";
// import LoadingSpinner from "../components/LoadingSpinner";

// const EditProducts = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);
//   const { fetchProducts, currency } = useContext(ShopContext);
//   const [productData, setProductData] = useState(null);
//   const [step, setStep] = useState(1);
//   const [productImages, setProductImages] = useState([]);

//   const notifySuccess = () => toast.success("Product Edited Successfully");
//   const notifyError = (error) => toast.error("Error Editing Product: " + error);

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
//     materialType: Yup.string().required("Material Type is required"),
//     productType: Yup.array()
//       .of(Yup.string())
//       .min(1, "At least one product type is required"),
//     imageUrls: Yup.array()
//       .of(Yup.string())
//       .min(1, "At least one image is required"),
//   });

//   const getProductData = async () => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get(
//         `https://toyshop-sooty.vercel.app/api/products/${id}`
//       );
//       setProductData(response.data);
//       setProductImages(response.data.imageUrls || []);
//     } catch (error) {
//       console.error("Error fetching product data:", error);
//       toast.error("Failed to load product data.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     getProductData();
//   }, [id]);

//   const getStepFields = (step) => {
//     switch (step) {
//       case 1:
//         return ["name", "description", "price", "stock", "materialType", "productType"];
//       case 2:
//         return ["imageUrls"];
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
//     setFieldValue("imageUrls", [
//       ...productImages.filter((img) => img.startsWith("https://")),
//       ...files,
//     ]);
//   };

//   const removeImage = (index, setFieldValue) => {
//     const updatedImages = productImages.filter((_, i) => i !== index);
//     setProductImages(updatedImages);
//     setFieldValue("imageUrls", updatedImages);
//   };

//   const handleSubmit = async (values, options = {}) => {
//     const { stayOnStep = false } = options;
//     try {
//       setIsLoading(true);
//       const formData = new FormData();
//       formData.append("name", values.name.trim());
//       formData.append("description", values.description);
//       formData.append("price", values.price);
//       formData.append("stock", values.stock);
//       formData.append("materialType", values.materialType);
//       values.productType.forEach((type) =>
//         formData.append("productType", type)
//       );

//       const existingUrls = values.imageUrls.filter(
//         (img) => typeof img === "string" && img.startsWith("https://")
//       );
//       const newFiles = values.imageUrls.filter((img) => img instanceof File);

//       if (existingUrls.length > 0) {
//         existingUrls.forEach((url) => formData.append("imageUrls", url));
//       }
//       newFiles.forEach((file) => formData.append("images", file));

//       for (let [key, value] of formData.entries()) {
//         console.log(key, value);
//       }

//       const response = await axios.put(
//         `https://toyshop-sooty.vercel.app/api/products/${id}`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       console.log("Response from API:", response.data);
//       setProductData(response.data);
//       setProductImages(response.data.imageUrls || []);
//       fetchProducts();
//       notifySuccess();

//       if (stayOnStep) {
//         setStep(2); // Stay on Images step
//       } else {
//         navigate("/products"); // Final submission
//       }
//     } catch (error) {
//       console.error("Error editing product:", error);
//       notifyError(error.response?.data?.message || "Something went wrong.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!productData || isLoading) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div className="p-8 bg-gray-100">
//       <div className="mx-auto bg-white shadow-md p-6">
//         <h1 className="text-3xl font-semibold text-gray-800 mb-6">
//           Edit Toy Product
//         </h1>
//         <Stepper steps={steps} currentStep={step - 1} />
//         <Formik
//           initialValues={{
//             name: productData.name || "",
//             description: productData.description || "",
//             price: productData.price || "",
//             stock: productData.stock || "",
//             materialType: productData.materialType || "",
//             productType: productData.productType || [],
//             imageUrls: productData.imageUrls || [],
//           }}
//           validationSchema={validationSchema}
//           onSubmit={(values) => handleSubmit(values)}
//           enableReinitialize={true}
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
//                         value={values.name}
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
//                       value={values.description}
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
//                       htmlFor="imageUrls"
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
//                         id="imageUrls"
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
//                     name="imageUrls"
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
//                         setStep(2); // Move to Images without saving
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

// export default EditProducts;

import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import Stepper from "../components/Stepper";
import { ShopContext } from "../context/ShopContext";
import LoadingSpinner from "../components/LoadingSpinner";

const EditProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { fetchProducts, currency } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [step, setStep] = useState(1);

  const notifySuccess = () => toast.success("Product Edited Successfully");
  const notifyError = (error) => toast.error("Error Editing Product: " + error);

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
    materialType: Yup.string().required("Material Type is required"),
    productType: Yup.array()
      .of(Yup.string())
      .min(1, "At least one product type is required"),
    categorySubcategoryPairs: Yup.array()
      .of(
        Yup.object({
          categoryID: Yup.string().required("Category ID is required"),
          subcategoryID: Yup.string().required("Subcategory ID is required"),
        })
      ),
    imageUrls: Yup.array()
      .of(Yup.string())
      .min(1, "At least one image is required"),
  });

  const getProductData = async () => {
    try {
      setIsLoading(true);
      const [productResponse, categoriesResponse] = await Promise.all([
        axios.get(`https://toyshop-sooty.vercel.app/api/products/${id}`),
        axios.get(`https://toyshop-sooty.vercel.app/api/categories`),
      ]);

      const product = productResponse.data;
      const categories = categoriesResponse.data;
      setCategories(categories);

      // Build categorySubcategoryPairs
      const pairs = [];
      categories.forEach((category) => {
        category.subcategories.forEach((subcategory) => {
          if (subcategory.products.includes(id)) {
            pairs.push({
              categoryID: category.categoryID,
              subcategoryID: subcategory.subcategoryID,
            });
          }
        });
      });

      setProductData({
        ...product,
        categorySubcategoryPairs: pairs.length > 0 ? pairs : [{ categoryID: "", subcategoryID: "" }],
      });
      setProductImages(product.imageUrls || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load product or categories.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProductData();
  }, [id]);

  const getStepFields = (step) => {
    switch (step) {
      case 1:
        return [
          "name",
          "description",
          "price",
          "stock",
          "materialType",
          "productType",
          "categorySubcategoryPairs",
        ];
      case 2:
        return ["imageUrls"];
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
    setFieldValue("imageUrls", [
      ...productImages.filter((img) => img.startsWith("https://")),
      ...files,
    ]);
  };

  const removeImage = (index, setFieldValue) => {
    const updatedImages = productImages.filter((_, i) => i !== index);
    setProductImages(updatedImages);
    setFieldValue("imageUrls", updatedImages);
  };

  const handleSubmit = async (values, options = {}) => {
    const { stayOnStep = false } = options;
    try {
      setIsLoading(true);

      // Prepare formData
      const formData = new FormData();
      formData.append("name", values.name.trim());
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("stock", values.stock);
      formData.append("materialType", values.materialType);
      values.productType.forEach((type) =>
        formData.append("productType", type)
      );

      const existingUrls = values.imageUrls.filter(
        (img) => typeof img === "string" && img.startsWith("https://")
      );
      const newFiles = values.imageUrls.filter((img) => img instanceof File);
      if (existingUrls.length > 0) {
        existingUrls.forEach((url) => formData.append("imageUrls", url));
      }
      newFiles.forEach((file) => formData.append("images", file));

      // Include categoryID/subcategoryID only if pairs exist
      if (
        values.categorySubcategoryPairs.length > 0 &&
        values.categorySubcategoryPairs.some(
          (pair) => pair.categoryID && pair.subcategoryID
        )
      ) {
        values.categorySubcategoryPairs.forEach((pair) => {
          if (pair.categoryID && pair.subcategoryID) {
            formData.append("categoryID", pair.categoryID);
            formData.append("subcategoryID", pair.subcategoryID);
          }
        });
      }

      // Update product
      const productResponse = await axios.put(
        `https://toyshop-sooty.vercel.app/api/products/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProductData(productResponse.data);
      setProductImages(productResponse.data.imageUrls || []);
      fetchProducts();
      notifySuccess();

      if (stayOnStep) {
        setStep(2);
      } else {
        navigate("/products");
      }
    } catch (error) {
      console.error("Error editing product:", error);
      notifyError(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!productData || isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-8 bg-gray-100">
      <div className="mx-auto bg-white shadow-md p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Edit Toy Product
        </h1>
        <Stepper steps={steps} currentStep={step - 1} />
        <Formik
          initialValues={{
            name: productData.name || "",
            description: productData.description || "",
            price: productData.price || "",
            stock: productData.stock || "",
            materialType: productData.materialType || "",
            productType: productData.productType || [],
            categorySubcategoryPairs: productData.categorySubcategoryPairs || [
              { categoryID: "", subcategoryID: "" },
            ],
            imageUrls: productData.imageUrls || [],
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => handleSubmit(values)}
          enableReinitialize={true}
        >
          {({ values, setFieldValue, errors, touched, validateForm }) => (
            <Form className="space-y-6">
              {/* Step 1: Basic Info & Details */}
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
                        value={values.name}
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
                      value={values.description}
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
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
                  <FieldArray name="categorySubcategoryPairs">
                    {({ push, remove }) => (
                      <div>
                        <label className="block text-gray-600 font-medium">
                          Categories & Subcategories
                        </label>
                        {values.categorySubcategoryPairs
                          .filter((pair) => pair && typeof pair === "object")
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
                                          {category.name} ({category.categoryID})
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
                                            {sub.name} ({sub.subcategoryID})
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
                </>
              )}

              {/* Step 2: Images */}
              {step === 2 && (
                <>
                  <label className="block text-gray-600 font-medium">
                    Product Images
                  </label>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <label
                      htmlFor="imageUrls"
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
                        id="imageUrls"
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
                          onClick={() => removeImage(index, setFieldValue)}
                          className="absolute top-1 right-1 bg-red-400 text-white text-xs px-2 py-1 rounded-full"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                  <ErrorMessage
                    name="imageUrls"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </>
              )}

              {/* Navigation Buttons */}
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

export default EditProducts;