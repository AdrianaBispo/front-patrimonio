import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { EquipmentForm } from "../components/EquipmentForm";
import { useEquipmentFormHook } from "../hooks/useEquipmentFormHook";

function fieldValue(record, ...keys) {
  for (const key of keys) {
    const value = record?.[key];
    if (value != null && value !== "") return value;
  }
  return "";
}

export default function EquipmentEditPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    loadEquipment,
    updateEquipment,
    statusList,
    userList,
    categoryList,
    typeList,
    isLoading,
    isLoadingData,
    inputsErrors,
  } = useEquipmentFormHook();

  const [name, setName] = useState("");
  const [serial, setSerial] = useState("");
  const [statusId, setStatusId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [equipmentTypeId, setEquipmentTypeId] = useState("");
  const [userId, setUserId] = useState("");
  const [description, setDescription] = useState("");
  const [currentImage, setCurrentImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!id) {
      navigate("/equipamentos", { replace: true });
      return;
    }

    const preloaded = location.state?.equipment ?? location.state?.equipamento;

    loadEquipment(id, preloaded)
      .then((record) => {
        setName(String(fieldValue(record, "eqi_name", "eqi_nome", "nome")));
        setSerial(String(fieldValue(record, "eqi_serie", "serie")));
        setStatusId(String(fieldValue(record, "eqi_status_id", "status_id")));
        setCategoryId(
          String(fieldValue(record, "categoria_id", "eqi_categoria_id")),
        );
        setEquipmentTypeId(
          String(
            fieldValue(record, "tipo_equipamento_id", "eqi_tipo_equipamento_id"),
          ),
        );
        setUserId(String(fieldValue(record, "usuario_id")));
        setDescription(
          String(fieldValue(record, "eqi_descricao", "descricao")),
        );

        const image = fieldValue(record, "imagem_url") || null;
        setCurrentImage(image);
        setSelectedImage(image);
      })
      .catch((err) => {
        toast.error(t(err?.message) ?? t("errors.equipmentError"));
        navigate("/equipamentos", { replace: true });
      });
  }, [id, loadEquipment, location.state, navigate, t]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!id) return;

    try {
      const result = await updateEquipment(
        id,
        {
          eqi_name: name,
          eqi_descricao: description,
          eqi_serie: serial,
          eqi_status_id: statusId,
          categoria_id: categoryId,
          tipo_equipamento_id: equipmentTypeId,
          usuario_id: userId,
          imagem_url: currentImage,
        },
        imageFile,
      );

      if (!result) return;

      toast.success(t("messages.equipmentUpdated"));
      navigate("/equipamentos");
    } catch (err) {
      toast.error(t(err?.message) ?? t("errors.equipmentError"));
    }
  }

  const handleChangeImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setSelectedImage(currentImage);
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
      setSelectedImage(currentImage);
      setImageFile(null);
      toast.error(t("equipment.validation.imageInvalidType"));
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-9 gap-2">
        <h3 className="mb-2 text-primary/80">{t("equipment.edit.title")}</h3>
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
        submitLabel={t("equipment.form.save")}
        selectedImage={selectedImage}
        onChangeImage={handleChangeImage}
      />
    </div>
  );
}
