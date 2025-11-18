import { useContext, useRef, useState } from "react";
import { FaImages } from "react-icons/fa";
import { LuChevronDown } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import CustomCalendar from "../../components/calendar/CustomCalendar";
import LanguageContext from "../../context/language/LanguageContext";
import { createTask } from "../../services/taskServices";
import "./CreateTask.css";

const CreateTask = () => {
  const fileRef = useRef(null);

  const navigate = useNavigate();

  const { t } = useContext(LanguageContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [selectedPriority, setSelectedPriority] = useState("low");
  const [dueDate, setDueDate] = useState(null);
  const [tags, setTags] = useState([]);
  const [addedTag, setAddedTag] = useState("");
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  const [openPriorityMenu, setOpenPriorityMenu] = useState(false);

  const [isSubmitting, setisSubmitting] = useState(false);

  // 🔹 Image add
  const handleAddImages = () => {
    const files = Array.from(fileRef.current.files);

    setSelectedImages((prev) => [...prev, ...files]);
    setImages((prev) => [...prev, ...files]);

    fileRef.current.value = "";
  };

  // 🔹 Remove image
  const handleRemoveSelectedImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 🔹 Tags
  const handleAddTag = () => {
    if (addedTag.trim() !== "") {
      setTags([...tags, addedTag.trim()]);
      setAddedTag("");
    }
  };

  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  // 🔹 Priority dropdown
  const togglePriorityMenu = () => {
    setOpenPriorityMenu(!openPriorityMenu);
  };

  const handleClickMenuItem = (option) => {
    setPriority(option);
    setSelectedPriority(option);
    setOpenPriorityMenu(false);
  };

  // 🔹 CREATE TASK
  const handleCreateTask = async (e) => {
    e.preventDefault();

    try {
      setisSubmitting(true);
      const data = new FormData();

      data.append("title", title);
      data.append("description", description);
      data.append("priority", priority);

      if (dueDate) data.append("dueDate", new Date(dueDate).toISOString());
      if (tags.length > 0) data.append("tags", JSON.stringify(tags));

      images.forEach((file) => {
        data.append("images", file);
      });

      const response = await createTask(data);
      setTitle("");
      setDescription("");
      setPriority("low");
      setDueDate(null);
      setTags([]);
      setImages([]);
      setSelectedImages([]);

      console.log("Task created:", response);
      navigate("/task-control");
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setisSubmitting(false);
    }
  };

  const priorityOptions = ["low", "medium", "high"];

  return (
    <div className="create-tast-container">
      <form onSubmit={handleCreateTask} className="create-task-form">
        {/* title */}
        <div className="form-item">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("createTask.title")}
            className="form-item__input"
          />
        </div>

        {/* description */}
        <div className="form-item">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("createTask.description")}
            className="form-item__input"
            rows={5}
          />
        </div>

        {/* priority */}
        <div className="form-item" onClick={togglePriorityMenu}>
          <input
            placeholder="Priority"
            className="form-item__input"
            readOnly
            value={selectedPriority.toUpperCase()}
          />
          <div className="form-item__icon">
            <LuChevronDown className="form-item__chevron" />
          </div>

          <div
            className={`form-item-options ${openPriorityMenu ? "open" : ""}`}
          >
            {priorityOptions.map((option) => (
              <div
                key={option}
                className="form-item__option"
                onClick={() => handleClickMenuItem(option)}
              >
                {option}
              </div>
            ))}
          </div>
        </div>

        {/* calendar */}
        <div className="form-item">
          <CustomCalendar selectedDay={dueDate} onSelect={setDueDate} />
        </div>

        {/* tags */}
        <div className="form-item-tags">
          <div className="tag-create">
            <input
              type="text"
              className="tag-create__input"
              placeholder="Tag"
              value={addedTag}
              onChange={(e) => setAddedTag(e.target.value)}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="tag-create__button"
            >
              {t("createTask.add").toUpperCase()}
            </button>
          </div>

          {tags.length > 0 && (
            <div className="tag-list">
              {tags.map((tag) => (
                <div key={tag} className="tag-item">
                  <span className="tag-item__name">{tag}</span>
                  <span
                    role="button"
                    className="tag-item__remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveTag(tag);
                    }}
                  >
                    X
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* images */}
        <div className="image-picker-container">
          <div className="image-picker" onClick={() => fileRef.current.click()}>
            <FaImages className="image-picker__icon" />
            <input
              type="file"
              multiple
              accept="image/*"
              ref={fileRef}
              style={{ display: "none" }}
              onChange={handleAddImages}
            />
          </div>
        </div>

        {/* image previews */}
        {selectedImages.length > 0 && (
          <div className="image-previews">
            {selectedImages.map((img, index) => (
              <div key={index} className="preview-item">
                <img
                  src={URL.createObjectURL(img)}
                  alt="preview"
                  className="preview-item__image"
                />
                <button
                  type="button"
                  className="image-preview__remove-btn"
                  onClick={() => handleRemoveSelectedImage(index)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="form-item">
          <button
            disabled={isSubmitting}
            type="submit"
            className="form-item__button"
          >
            {isSubmitting
              ? t("createTask.creating").toUpperCase()
              : t("createTask.create").toUpperCase()}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTask;
