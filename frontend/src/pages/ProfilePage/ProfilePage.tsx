import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { UPDATE_USER_MUTATION } from "../../graphql/mutations/updateUser";
import { useUser } from "../../context/userContext";
import { useState } from "react";
import "./ProfilePage.scss";

type FormData = {
  username?: string;
  description?: string;
  image?: string;
  birthday?: string;
  gender?: string;
};

const ProfilePage = () => {
  const { user } = useUser();
  const [editingField, setEditingField] = useState<keyof FormData | null>(null);
  const [updateUser] = useMutation(UPDATE_USER_MUTATION);
  const { register, setValue, watch } = useForm<FormData>();

  if (!user) return <div>Chargement...</div>;

  const onSubmit = async () => {
    if (!editingField) return;

    const value = watch(editingField);
    const data: Record<string, any> = {};

    if (editingField === "birthday") {
      if (value) {
        try {
          const iso = new Date(value).toISOString();
          if (isNaN(Date.parse(iso))) throw new Error();
          data.birthday = iso;
        } catch {
          alert("Date invalide !");
          return;
        }
      }
    } else if (editingField === "gender") {
      if (value === "true") data.gender = true;
      else if (value === "false") data.gender = false;
    } else if (typeof value === "string" && value.trim() !== "") {
      data[editingField] = value;
    }

    try {
      await updateUser({
        variables: { data },
        refetchQueries: ["Me"],
      });
      setEditingField(null);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la mise à jour");
    }
  };

  const startEdit = (field: keyof FormData, currentValue: any) => {
    if (field === "birthday" && currentValue) {
      const formatted = new Date(currentValue).toISOString().split("T")[0];
      setValue(field, formatted);
    } else {
      setValue(field, currentValue ?? "");
    }
    setEditingField(field);
  };

  return (
    <div className="profile">
      <div className="profile__card">
        <h1 className="profile__title">Mon profil</h1>
        <img src={user.image || "/default-avatar.png"} alt="avatar" className="profile__avatar" />

        <form onSubmit={(e) => e.preventDefault()} className="profile__form">
          {/* Nom d'utilisateur */}
          <div className="profile__field">
            <label>Nom d'utilisateur :</label>
            {editingField === "username" ? (
              <div className="profile__edit">
                <input {...register("username")} className="profile__input" />
                <button type="button" onClick={onSubmit} className="profile__save">
                  💾
                </button>
              </div>
            ) : (
              <div className="profile__display">
                <span>{user.username}</span>
                <button type="button" onClick={() => startEdit("username", user.username)}>
                  ✏️
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="profile__field">
            <label>Description :</label>
            {editingField === "description" ? (
              <div className="profile__edit">
                <textarea {...register("description")} className="profile__input" />
                <button type="button" onClick={onSubmit} className="profile__save">
                  💾
                </button>
              </div>
            ) : (
              <div className="profile__display">
                <span>{user.description || "Aucune description"}</span>
                <button type="button" onClick={() => startEdit("description", user.description)}>
                  ✏️
                </button>
              </div>
            )}
          </div>

          {/* Image */}
          <div className="profile__field">
            <label>Image (URL) :</label>
            {editingField === "image" ? (
              <div className="profile__edit">
                <input {...register("image")} className="profile__input" />
                <button type="button" onClick={onSubmit} className="profile__save">
                  💾
                </button>
              </div>
            ) : (
              <div className="profile__display">
                <span>{user.image || "Aucune image"}</span>
                <button type="button" onClick={() => startEdit("image", user.image)}>
                  ✏️
                </button>
              </div>
            )}
          </div>

          {/* Date de naissance */}
          <div className="profile__field">
            <label>Date de naissance :</label>
            {editingField === "birthday" ? (
              <div className="profile__edit">
                <input type="date" {...register("birthday")} className="profile__input" />
                <button type="button" onClick={onSubmit} className="profile__save">
                  💾
                </button>
              </div>
            ) : (
              <div className="profile__display">
                <span>{user.birthday ? new Date(user.birthday).toLocaleDateString("fr-FR") : "--"}</span>
                <button type="button" onClick={() => startEdit("birthday", user.birthday)}>
                  ✏️
                </button>
              </div>
            )}
          </div>

          {/* Genre */}
          <div className="profile__field">
            <label>Genre :</label>
            {editingField === "gender" ? (
              <div className="profile__edit">
                <select {...register("gender")} className="profile__input">
                  <option value="">--</option>
                  <option value="true">Homme</option>
                  <option value="false">Femme</option>
                </select>
                <button type="button" onClick={onSubmit} className="profile__save">
                  💾
                </button>
              </div>
            ) : (
              <div className="profile__display">
                <span>{user.gender === true ? "Homme" : user.gender === false ? "Femme" : "--"}</span>
                <button type="button" onClick={() => startEdit("gender", String(user.gender))}>
                  ✏️
                </button>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="profile__field">
            <label>Email :</label>
            <div className="profile__display">
              <span>{user.email}</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
