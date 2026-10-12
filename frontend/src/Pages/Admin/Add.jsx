import React, { useState } from 'react';
import { assets } from '../../assets/Admin/assets';
import axios from 'axios';
import { backendUrl } from '../../App';
import { toast } from 'react-toastify';
import {
  MdCloudUpload,
  MdClose,
  MdAdd,
  MdStar,
  MdCheckCircle,
  MdColorLens,
  MdStraighten,
  MdOpacity,
  MdTune,
  MdDescription,
  MdInfo,
  MdPhone
} from 'react-icons/md'; // ✅ Fixed: changed /png to /md

// SECTION COMPONENT
const Section = ({ icon, title, subtitle, children, badge, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 ${isOpen
          ? 'border-indigo-200 shadow-lg shadow-indigo-100/50 bg-white'
          : 'border-gray-200 bg-white/80 hover:bg-white hover:shadow-md'
        }`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-4 p-5 text-left"
      >
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0 ${isOpen
              ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-300/50'
              : 'bg-gray-100 text-gray-500'
            }`}
        >
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={`font-semibold transition-colors ${isOpen ? 'text-indigo-700' : 'text-gray-800'
                }`}
            >
              {title}
            </h3>
            {badge && (
              <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''
            }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        style={{
          maxHeight: isOpen ? '5000px' : '0px',
          opacity: isOpen ? 1 : 0,
          transition: 'max-height 0.5s ease-in-out, opacity 0.3s ease-in-out',
        }}
        className="overflow-hidden"
      >
        <div className="px-5 pb-6 pt-2 space-y-4">{children}</div>
      </div>
    </div>
  );
};

// TAG COMPONENT
const Tag = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:shadow-md">
    {label}
    <button
      type="button"
      onClick={onRemove}
      className="hover:text-red-500 transition-colors"
    >
      <MdClose className="w-3.5 h-3.5" />
    </button>
  </span>
);

// IMAGE CARD COMPONENT
const ImageCard = ({ image, setter }) => (
  <div className="relative group">
    <label className="cursor-pointer block">
      <div
        className={`relative w-full aspect-square rounded-2xl border-2 border-dashed overflow-hidden transition-all duration-300 ${image
            ? 'border-indigo-300 shadow-lg shadow-indigo-100/50'
            : 'border-gray-300 hover:border-indigo-400 hover:shadow-md'
          }`}
      >
        {image ? (
          <>
            <img
              src={URL.createObjectURL(image)}
              className="w-full h-full object-cover"
              alt=""
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <MdCloudUpload className="text-white text-3xl" />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 group-hover:text-indigo-500 transition-colors p-2">
            <MdCloudUpload className="text-3xl mb-1" />
            <span className="text-xs font-medium text-center">Upload</span>
          </div>
        )}
      </div>
      <input
        type="file"
        hidden
        accept="image/*"
        onChange={(e) => setter(e.target.files[0])}
      />
    </label>

    {image && (
      <button
        type="button"
        onClick={() => setter(false)}
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600"
      >
        <MdClose className="w-3.5 h-3.5" />
      </button>
    )}
  </div>
);

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [brand, setBrand] = useState('');
  const [productType, setProductType] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [bestseller, setBestseller] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');

  const [sizeInput, setSizeInput] = useState('');
  const [sizes, setSizes] = useState([]);
  const clothingSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  const shoeSizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];
  const generalSizes = ['Small', 'Medium', 'Large', 'Extra Large'];

  const [colorName, setColorName] = useState('');
  const [colorHex, setColorHex] = useState('#6366f1');
  const [colors, setColors] = useState([]);

  const [mlInput, setMlInput] = useState('');
  const [mlOptions, setMlOptions] = useState([]);

  const [attrKey, setAttrKey] = useState('');
  const [attrValue, setAttrValue] = useState('');
  const [attributes, setAttributes] = useState([]);

  const [overview, setOverview] = useState('');
  const [highlights, setHighlights] = useState(['']);
  const [specifications, setSpecifications] = useState([{ key: '', value: '' }]);
  const [directions, setDirections] = useState('');
  const [keyFeatures, setKeyFeatures] = useState(['']);
  const [importantInfo, setImportantInfo] = useState('');
  const [productDetails, setProductDetails] = useState([{ key: '', value: '' }]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const addCustomSize = () => {
    const trimmed = sizeInput.trim();
    if (!trimmed) return;
    if (sizes.includes(trimmed)) return toast.error('Size already added');
    setSizes([...sizes, trimmed]);
    setSizeInput('');
  };

  const togglePresetSize = (size) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const addMlOption = () => {
    const trimmed = mlInput.trim();
    if (!trimmed) return;
    if (mlOptions.includes(trimmed)) return toast.error('Already added');
    setMlOptions([...mlOptions, trimmed]);
    setMlInput('');
  };

  const addAttribute = () => {
    if (!attrKey.trim() || !attrValue.trim()) return toast.error('Fill both fields');
    if (attributes.find((a) => a.key === attrKey.trim())) return toast.error('Key exists');
    setAttributes([...attributes, { key: attrKey.trim(), value: attrValue.trim() }]);
    setAttrKey('');
    setAttrValue('');
  };

  const resetForm = () => {
    setName(''); setDescription(''); setPrice('');
    setStock(''); setBrand(''); setProductType('');
    setCategory(''); setSubCategory(''); setWhatsappNumber('');
    setImage1(false); setImage2(false);
    setImage3(false); setImage4(false);
    setSizes([]); setSizeInput('');
    setColors([]); setColorName(''); setColorHex('#6366f1');
    setMlOptions([]); setMlInput('');
    setAttributes([]); setAttrKey(''); setAttrValue('');
    setBestseller(false);
    setOverview(''); setHighlights(['']);
    setSpecifications([{ key: '', value: '' }]);
    setDirections(''); setKeyFeatures(['']);
    setImportantInfo('');
    setProductDetails([{ key: '', value: '' }]);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!category.trim()) return toast.error('Enter a category');
    if (!subCategory.trim()) return toast.error('Enter a sub category');
    if (!whatsappNumber.trim()) return toast.error('WhatsApp checkout routing number is required');

    const maxSize = 10 * 1024 * 1024;
    for (let img of [image1, image2, image3, image4]) {
      if (img && img.size > maxSize) return toast.error('Image exceeds 10MB');
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category.trim());
      formData.append('subCategory', subCategory.trim());
      formData.append('bestseller', bestseller);
      formData.append('stock', stock || 0);
      formData.append('brand', brand || '');
      formData.append('productType', productType || '');
      formData.append('sizes', JSON.stringify(sizes));
      formData.append('colors', JSON.stringify(colors));
      formData.append('mlOptions', JSON.stringify(mlOptions));
      formData.append('whatsappNumber', whatsappNumber.trim());

      const attrObj = {};
      attributes.forEach((a) => (attrObj[a.key] = a.value));
      formData.append('attributes', JSON.stringify(attrObj));

      const longDescription = {};
      if (overview.trim()) longDescription.overview = overview.trim();
      const fH = highlights.filter((h) => h.trim());
      if (fH.length) longDescription.highlights = fH;
      const fS = specifications.filter((s) => s.key.trim() && s.value.trim());
      if (fS.length) longDescription.specifications = fS;
      if (directions.trim()) longDescription.directions = directions.trim();
      const fK = keyFeatures.filter((f) => f.trim());
      if (fK.length) longDescription.keyFeatures = fK;
      if (importantInfo.trim()) longDescription.importantInfo = importantInfo.trim();
      const fP = productDetails.filter((d) => d.key.trim() && d.value.trim());
      if (fP.length) longDescription.productDetails = fP;
      formData.append('longDescription', JSON.stringify(longDescription));

      if (image1) formData.append('image1', image1);
      if (image2) formData.append('image2', image2);
      if (image3) formData.append('image3', image3);
      if (image4) formData.append('image4', image4);

      const response = await axios.post(`${backendUrl}/api/product/add`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        resetForm();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-300/40 flex-shrink-0">
            <MdAdd className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Specify product properties and configure individual WhatsApp ordering!
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmitHandler} className="space-y-4">

        {/* BASIC INFO SECTION */}
        <Section
          icon={<MdInfo className="text-xl" />}
          title="Basic Information"
          subtitle="Key information, images, and WhatsApp number for this product"
          badge="Required"
          defaultOpen={true}
        >
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              Product Images
              <span className="text-gray-400 font-normal text-xs">(Max 4, 10MB each)</span>
            </label>
            <div className="grid grid-cols-4 gap-4">
              <ImageCard image={image1} setter={setImage1} />
              <ImageCard image={image2} setter={setImage2} />
              <ImageCard image={image3} setter={setImage3} />
              <ImageCard image={image4} setter={setImage4} />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
              Product Name <span className="text-red-400">*</span>
            </label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Nike Air Max 90, Designer Perfume..."
              required className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500" />
          </div>

          {/* ✅ WhatsApp number for this specific product */}
          <div>
            <label className="text-sm font-semibold text-indigo-700 mb-1.5 flex items-center gap-2">
              <MdPhone className="text-indigo-600" /> WhatsApp Number for Direct Ordering <span className="text-red-400">*</span>
            </label>
            <input type="text" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="e.g. 923001234567 (with country code, no + or spaces)"
              required className="w-full border border-indigo-300 bg-indigo-50/20 rounded-xl px-4 py-3 font-medium text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
              Short Description <span className="text-red-400">*</span>
            </label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief product description..." required rows={3}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 resize-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Product Type</label>
              <input type="text" value={productType} onChange={(e) => setProductType(e.target.value)}
                placeholder="e.g. Clothing, Electronics, Toy..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Brand</label>
              <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Nike, Samsung..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Category <span className="text-red-400">*</span>
              </label>
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Men, Electronics..." required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Sub Category <span className="text-red-400">*</span>
              </label>
              <input type="text" value={subCategory} onChange={(e) => setSubCategory(e.target.value)}
                placeholder="e.g. Topwear, Action Figures..." required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Price ($) <span className="text-red-400">*</span>
              </label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00" required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Stock Quantity</label>
              <input type="number" value={stock} onChange={(e) => setStock(e.target.value)}
                placeholder="0"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          <label className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200 cursor-pointer hover:shadow-md transition-all">
            <input type="checkbox" checked={bestseller} onChange={() => setBestseller(!bestseller)}
              className="w-5 h-5 checked:accent-amber-500" />
            <MdStar className="text-amber-500 text-xl" />
            <div>
              <p className="text-sm font-semibold text-gray-800">Best Seller</p>
              <p className="text-xs text-gray-500">Show in featured catalog</p>
            </div>
          </label>
        </Section>

        {/* VARIANTS SECTION */}
        <Section
          icon={<MdStraighten className="text-xl" />}
          title="Variants & Options"
          subtitle="Sizes, colors, volume options"
          badge="Optional"
          defaultOpen={false}
        >
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <MdStraighten className="text-indigo-500" /> Sizes
            </label>
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-2">👕 Clothing:</p>
              <div className="flex gap-2 flex-wrap">
                {clothingSizes.map((s) => (
                  <button key={s} type="button" onClick={() => togglePresetSize(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${sizes.includes(s) ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-2">👟 Shoes:</p>
              <div className="flex gap-2 flex-wrap">
                {shoeSizes.map((s) => (
                  <button key={s} type="button" onClick={() => togglePresetSize(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${sizes.includes(s) ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-2">📦 General:</p>
              <div className="flex gap-2 flex-wrap">
                {generalSizes.map((s) => (
                  <button key={s} type="button" onClick={() => togglePresetSize(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${sizes.includes(s) ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <input type="text" value={sizeInput} onChange={(e) => setSizeInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSize())}
                placeholder="Custom size (e.g. 6-12 months)"
                className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none" />
              <button type="button" onClick={addCustomSize}
                className="bg-indigo-500 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-600">
                <MdAdd />
              </button>
            </div>
            {sizes.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-3">
                {sizes.map((s) => (
                  <Tag key={s} label={s} onRemove={() => setSizes(sizes.filter((x) => x !== s))} />
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <MdColorLens className="text-indigo-500" /> Colors
            </label>
            <div className="flex gap-2 items-center">
              <input type="text" value={colorName} onChange={(e) => setColorName(e.target.value)}
                placeholder="Color name (e.g. Sky Blue)"
                className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none" />
              <input type="color" value={colorHex} onChange={(e) => setColorHex(e.target.value)}
                className="w-12 h-11 rounded-xl cursor-pointer border border-gray-300" />
              <button type="button" onClick={() => {
                if (!colorName.trim()) return;
                setColors([...colors, { name: colorName.trim(), hex: colorHex }]);
                setColorName(''); setColorHex('#6366f1');
              }} className="bg-indigo-500 text-white px-4 py-2.5 rounded-xl">
                <MdAdd />
              </button>
            </div>
            {colors.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-3">
                {colors.map((c, i) => (
                  <span key={i} className="inline-flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-full text-sm">
                    <span className="w-5 h-5 rounded-full border-2 border-white shadow-sm flex-shrink-0" style={{ backgroundColor: c.hex }} />
                    <span className="font-medium text-gray-700">{c.name}</span>
                    <button type="button" onClick={() => setColors(colors.filter((_, idx) => idx !== i))}
                      className="text-gray-400 hover:text-red-500">
                      <MdClose className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <MdOpacity className="text-indigo-500" /> Volume / ML Options
            </label>
            <div className="flex gap-2 flex-wrap mb-3">
              {['30ml', '50ml', '100ml', '150ml', '200ml', '250ml', '500ml', '1L'].map((ml) => (
                <button key={ml} type="button"
                  onClick={() => setMlOptions((prev) => prev.includes(ml) ? prev.filter((m) => m !== ml) : [...prev, ml])}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${mlOptions.includes(ml) ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {ml}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={mlInput} onChange={(e) => setMlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addMlOption())}
                placeholder="Custom (e.g. 75ml)"
                className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none" />
              <button type="button" onClick={addMlOption}
                className="bg-indigo-500 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-600">
                <MdAdd />
              </button>
            </div>
            {mlOptions.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-3">
                {mlOptions.map((ml) => (
                  <Tag key={ml} label={ml} onRemove={() => setMlOptions(mlOptions.filter((m) => m !== ml))} />
                ))}
              </div>
            )}
          </div>
        </Section>

        {/* CUSTOM ATTRIBUTES */}
        <Section
          icon={<MdTune className="text-xl" />}
          title="Custom Attributes"
          subtitle="Add customizable metadata dynamically"
          badge="Dynamic"
          defaultOpen={false}
        >
          <div className="flex gap-2">
            <input type="text" value={attrKey} onChange={(e) => setAttrKey(e.target.value)}
              placeholder="Attribute Key"
              className="w-1/3 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
            <input type="text" value={attrValue} onChange={(e) => setAttrValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAttribute())}
              placeholder="Value"
              className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
            <button type="button" onClick={addAttribute}
              className="bg-indigo-500 text-white px-4 py-2.5 rounded-xl">
              <MdAdd />
            </button>
          </div>
          {attributes.length > 0 && (
            <div className="rounded-xl border border-gray-200 overflow-hidden mt-3">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <th className="text-left px-4 py-3 text-gray-600">Attribute</th>
                    <th className="text-left px-4 py-3 text-gray-600">Value</th>
                    <th className="w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {attributes.map((attr, i) => (
                    <tr key={i} className="border-t border-gray-100 hover:bg-indigo-50/50">
                      <td className="px-4 py-3 font-medium text-gray-700">{attr.key}</td>
                      <td className="px-4 py-3 text-gray-600">{attr.value}</td>
                      <td className="px-4 py-3 text-center">
                        <button type="button" onClick={() => setAttributes(attributes.filter((a) => a.key !== attr.key))}
                          className="text-red-400 hover:text-red-600"><MdClose /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>

        {/* DETAILED DESCRIPTION SECTION */}
        <Section
          icon={<MdDescription className="text-xl" />}
          title="Detailed Description"
          subtitle="Product specifications and overview highlights"
          badge="Optional"
          defaultOpen={false}
        >
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Product Overview</label>
            <textarea value={overview} onChange={(e) => setOverview(e.target.value)}
              placeholder="Detailed product overview..." rows={4}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 resize-none" />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Highlights</label>
            {highlights.map((h, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input value={h} onChange={(e) => { const a = [...highlights]; a[i] = e.target.value; setHighlights(a); }}
                  placeholder={`Highlight ${i + 1}`}
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
                {highlights.length > 1 && (
                  <button type="button" onClick={() => setHighlights(highlights.filter((_, idx) => idx !== i))}
                    className="text-red-400 hover:text-red-600 px-2"><MdClose /></button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => setHighlights([...highlights, ''])}
              className="text-indigo-600 text-sm font-medium">+ Add Highlight</button>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Specifications</label>
            {specifications.map((spec, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input value={spec.key} onChange={(e) => { const a = [...specifications]; a[i].key = e.target.value; setSpecifications(a); }}
                  placeholder="Key" className="w-1/3 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
                <input value={spec.value} onChange={(e) => { const a = [...specifications]; a[i].value = e.target.value; setSpecifications(a); }}
                  placeholder="Value" className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
              </div>
            ))}
            <button type="button" onClick={() => setSpecifications([...specifications, { key: '', value: '' }])}
              className="text-indigo-600 text-sm font-medium">+ Add Specification</button>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Product Details Table</label>
            {productDetails.map((d, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input value={d.key} onChange={(e) => { const a = [...productDetails]; a[i].key = e.target.value; setProductDetails(a); }}
                  placeholder="Key" className="w-1/3 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
                <input value={d.value} onChange={(e) => { const a = [...productDetails]; a[i].value = e.target.value; setProductDetails(a); }}
                  placeholder="Value" className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
              </div>
            ))}
            <button type="button" onClick={() => setProductDetails([...productDetails, { key: '', value: '' }])}
              className="text-indigo-600 text-sm font-medium">+ Add Detail</button>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Directions</label>
            <textarea value={directions} onChange={(e) => setDirections(e.target.value)}
              placeholder="Directions of usage..." rows={3}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 resize-none" />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Key Features</label>
            {keyFeatures.map((f, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input value={f} onChange={(e) => { const a = [...keyFeatures]; a[i] = e.target.value; setKeyFeatures(a); }}
                  placeholder={`Feature ${i + 1}`}
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
                {keyFeatures.length > 1 && (
                  <button type="button" onClick={() => setKeyFeatures(keyFeatures.filter((_, idx) => idx !== i))}
                    className="text-red-400 hover:text-red-600 px-2"><MdClose /></button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => setKeyFeatures([...keyFeatures, ''])}
              className="text-indigo-600 text-sm font-medium">+ Add Feature</button>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Important Information</label>
            <textarea value={importantInfo} onChange={(e) => setImportantInfo(e.target.value)}
              placeholder="Add safety info or critical notes..." rows={3}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 resize-none" />
          </div>
        </Section>

        {/* SUBMIT BUTTON */}
        <button type="submit" disabled={isSubmitting}
          className={`w-full py-4 rounded-2xl font-semibold text-white text-base transition-all duration-300 shadow-xl ${isSubmitting ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]'
            }`}>
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Uploading Product to Database...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <MdCheckCircle className="text-xl" /> Publish Product Listing
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

export default Add;