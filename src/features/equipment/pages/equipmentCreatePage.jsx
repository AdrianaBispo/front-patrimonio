import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { EquipmentForm } from "../components/EquipmentForm";
import { useEquipmentFormHook } from "../hooks/useEquipmentFormHook";

export default function EquipmentCreatePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    createEquipment,
    loadFormOptions,
    statusList,
    userList,
    categoryList,
    typeList,
    isLoading,
    isLoadingOptions,
    inputsErrors,
  } = useEquipmentFormHook();

  const [name, setName] = useState("");
  const [serial, setSerial] = useState("");
  const [statusId, setStatusId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [equipmentTypeId, setEquipmentTypeId] = useState("");
  const [userId, setUserId] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    loadFormOptions().catch((err) => {
      toast.error(t(err?.message) ?? t("errors.equipmentError"));
    });
  }, [loadFormOptions, t]);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const result = await createEquipment(
        {
          eqi_name: name,
          eqi_descricao: description,
          eqi_serie: serial,
          eqi_status_id: statusId,
          categoria_id: categoryId,
          tipo_equipamento_id: equipmentTypeId,
          usuario_id: userId,
          imagem_url: null,
        },
        imageFile,
      );

      if (!result) return;

      toast.success(t("messages.equipmentCreated"));
      navigate("/equipamentos");
    } catch (err) {
      toast.error(t(err?.message) ?? t("errors.equipmentError"));
    }
  }

  const handleChangeImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setSelectedImage(null);
      setImageFile(null);
      return;
    }

    if (file.size >= 5 * 1024 * 1024) {
      toast.error(t("equipment.validation.imageTooLarge"));
      return;
    }

    const typeOk =
      file.type === "image/jpeg" ||
      file.type === "image/jpg" ||
      file.type === "image/png";

    if (file.size > 0 && typeOk) {
      setSelectedImage(URL.createObjectURL(file));
      setImageFile(file);
    } else {
      setSelectedImage(null);
      setImageFile(null);
      toast.error(t("equipment.validation.imageInvalidType"));
    }
  };

  if (isLoadingOptions) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-9 gap-2">
        <h3 className="mb-2 text-primary/80">{t("equipment.create.title")}</h3>
        <p>{t("equipment.create.subtitle")}</p>
      </div>

      <EquipmentForm
        name={name}
        setName={setName}
        serial={serial}
        setSerial={setSerial}
        statusId={statusId}
        setStatusId={setStatusId}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        equipmentTypeId={equipmentTypeId}
        setEquipmentTypeId={setEquipmentTypeId}
        userId={userId}
        setUserId={setUserId}
        description={description}
        setDescription={setDescription}
        statusList={statusList}
        categoryList={categoryList}
        typeList={typeList}
        userList={userList}
        isLoading={isLoading}
        inputsErrors={inputsErrors}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
        submitLabel={t("equipment.form.create")}
        selectedImage={selectedImage}
        onChangeImage={handleChangeImage}
      />
    </div>
  );
}
