import React, { useEffect, useState } from "react";
import { auth, firestore } from "../configure";
import { signOut } from "firebase/auth";
import { updateDoc, doc, onSnapshot, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import profile from "../../public/profile-img.jpeg";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import useFetch from "../hook/useFetch";

const Account = () => {
  const { user, loading } = useFetch();
  const [userInfo, setUserInfo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showUploadDiv, setShowUploadDiv] = useState(false);
  const [loader, setloader] = useState(false);
  const navigate = useNavigate();
  // console.log("account", user);
  useEffect(() => {
    if (user) {
      setloader(true);
      const fetchData = async () => {
        try {
          const userRef = doc(firestore, "users", user.uid);
          await onSnapshot(userRef, (doc) => {
            setUserInfo(doc.data());
          });
        } finally {
          setloader(false);
        }
      };

      fetchData();
    }
  }, [loading]);

  const handleLogout = async () => {
    try {
      setloader(true);
      await signOut(auth);
      localStorage.removeItem("user");
      setUserInfo(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setloader(false);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      setloader(true);
      await updateDoc(doc(firestore, "users", user.uid), userInfo);
      setEditMode(false);
    } catch (error) {
      console.log(error);
    } finally {
      setloader(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleUploadImage = async () => {
    if (selectedImage) {
      setloader(true);
      try {
        const storage = getStorage();
        const storageRef = ref(storage, `profile-images/${user.uid}`);
        await uploadBytes(storageRef, selectedImage);
        const imageUrl = await getDownloadURL(storageRef);
        setUserInfo({
          ...userInfo,
          profileImage: imageUrl,
        });
        await setDoc(doc(firestore, "users", user.uid), {
          ...userInfo,
          profileImage: imageUrl,
        });
        setSelectedImage(null);
        setShowUploadDiv(false);
      } catch (error) {
        console.error("Image upload error:", error);
      } finally {
        setloader(false);
      }
    }
  };

  return (
    <div className="container">
      <h2>Account Information</h2>

      <p>Welcome, {userInfo?.username || "user"}</p>
      {loader && <p>Loading...</p>}
      <div className="card mb-3 profile-container" style={{ maxWidth: 540 }}>
        <div className="row g-0 profile-card">
          <div className="col-md-4">
            <img
              src={userInfo?.profileImage || profile}
              className="profile-img"
            />
            {showUploadDiv && (
              <div className="input-group mb-2">
                <input
                  type="file"
                  accept="image/*"
                  // className="form-control"
                  // id="inputGroupFile02"

                  onChange={handleImageChange}
                />
                <label
                  className="btn"
                  // className="input-group-text"
                  // htmlFor="inputGroupFile02"
                  onClick={handleUploadImage}
                >
                  Upload
                </label>
              </div>
            )}
            <button
              className={`btn ${showUploadDiv ? "btn-danger" : "btn-primary"}`}
              onClick={() => setShowUploadDiv(!showUploadDiv)}
            >
              {showUploadDiv ? "Cancel" : "Select Photo"}
            </button>
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h5 className="card-title">Profile Detail</h5>
              {loading && <p>Loading...</p>}
              {userInfo && (
                <div>
                  <p>
                    <strong>Email:</strong> {userInfo?.email}
                  </p>

                  {editMode ? (
                    <div>
                      <div className="mb-2">
                        <label>
                          Username:
                          <input
                            type="text"
                            className="form-control"
                            value={userInfo.username || "user"}
                            onChange={(e) =>
                              setUserInfo({
                                ...userInfo,
                                username: e.target.value,
                              })
                            }
                          />
                        </label>
                      </div>
                      <div className="mb-2">
                        <label>
                          Mobile Number:
                          <input
                            type="text"
                            className="form-control"
                            value={userInfo.mobileNumber || ""}
                            onChange={(e) =>
                              setUserInfo({
                                ...userInfo,
                                mobileNumber: e.target.value,
                              })
                            }
                          />
                        </label>
                      </div>
                      <div className="mb-2">
                        <label>
                          Date of Birth:
                          <input
                            type="date"
                            className="form-control"
                            value={userInfo.dob || ""}
                            onChange={(e) =>
                              setUserInfo({ ...userInfo, dob: e.target.value })
                            }
                          />
                        </label>
                      </div>
                      <div className="mb-2">
                        <label>
                          Address:
                          <input
                            type="text"
                            className="form-control"
                            value={userInfo.address || ""}
                            onChange={(e) =>
                              setUserInfo({
                                ...userInfo,
                                address: e.target.value,
                              })
                            }
                          />
                        </label>
                      </div>
                      <button className="btn btn-success" onClick={handleSave}>
                        Update
                      </button>{" "}
                      {/* <button
                        className="btn btn-secondary"
                        onClick={() => {
                          setEditMode(false);
                        }}
                      >
                        Close
                      </button> */}
                    </div>
                  ) : (
                    <div>
                      <p>
                        <strong>Username:</strong> {userInfo?.username}
                      </p>
                      <p>
                        <strong>Mobile Number:</strong>{" "}
                        {userInfo?.mobileNumber || "Not provided"}
                      </p>
                      <p>
                        <strong>Date of Birth:</strong>{" "}
                        {userInfo?.dob || "Not provided"}
                      </p>
                      <p>
                        <strong>Address:</strong>{" "}
                        {userInfo?.address || "Not provided"}
                      </p>
                      <button className="btn btn-primary" onClick={handleEdit}>
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <button className="btn btn-danger" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Account;
