import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut,
} from '../redux/user/userSlice';

export default function Profile() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setupdateSuccess] = useState(false);

  const { currentUser, loading, error } = useSelector((state) => state.user);
  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);
  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profilePicture: downloadURL })
        );
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/user/update/${currentUser._id}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setupdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/auth/signout`, {
        credentials: 'include',
      });
      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-black pt-24 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="mb-6 relative py-6 flex justify-center items-center text-black dark:text-white text-5xl font-extrabold text-center">
            <span className="absolute hidden inset-0 w-full h-full dark:flex justify-center items-center bg-gradient-to-r blur-xl from-purple-500 via-purple-500 to-purple-500 bg-clip-text text-5xl box-content font-extrabold text-transparent select-none">
              Profile
            </span>
            Profile
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Profile Form */}
        <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-xl p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center space-y-4">
              <input
                type="file"
                ref={fileRef}
                hidden
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
              <div
                onClick={() => fileRef.current.click()}
                className="relative inline-flex self-center group cursor-pointer"
              >
                <img
                  src={currentUser.profilePicture}
                  alt="profile picture"
                  className="h-32 w-32 self-center rounded-full object-cover border-4 border-black dark:border-purple-500 shadow-lg hover:shadow-xl transition-all duration-300"
                />
                <div className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 border-2 border-white dark:border-purple-500 transition-all duration-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
              </div>

              {/* Upload Status */}
              <div className="text-center">
                {imageError ? (
                  <span className="text-red-600 dark:text-red-400 font-semibold">
                    Error Uploading Image (file size must be less than 2 MB)
                  </span>
                ) : imagePercent > 0 && imagePercent < 100 ? (
                  <span className="text-purple-600 dark:text-purple-400 font-semibold">
                    Uploading: {imagePercent}%
                  </span>
                ) : imagePercent === 100 ? (
                  <span className="text-green-600 dark:text-green-400 font-semibold">
                    Image Uploaded Successfully! Press Update to save changes.
                  </span>
                ) : (
                  <span className="text-gray-600 dark:text-gray-400">
                    Click the edit icon to change your profile picture
                  </span>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-black dark:text-white mb-2">
                  Username
                </label>
                <input
                  defaultValue={currentUser.username}
                  type="text"
                  id="username"
                  placeholder="Username"
                  className="w-full bg-amber-100 dark:bg-gray-800 border border-black dark:border-purple-500 rounded-xl p-4 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition-all duration-300"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-black dark:text-white mb-2">
                  Email
                </label>
                <input
                  defaultValue={currentUser.email}
                  type="email"
                  id="email"
                  placeholder="Email"
                  className="w-full bg-amber-100 dark:bg-gray-800 border border-black dark:border-purple-500 rounded-xl p-4 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition-all duration-300"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-black dark:text-white mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="New Password (leave blank to keep current)"
                  className="w-full bg-amber-100 dark:bg-gray-800 border border-black dark:border-purple-500 rounded-xl p-4 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition-all duration-300"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Update Button */}
            <button
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:transform hover:scale-105 shadow-lg disabled:transform-none disabled:shadow-none"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-600">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <button
                onClick={handleDeleteAccount}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-300 hover:transform hover:scale-105 shadow-lg"
              >
                Delete Account
              </button>
              <button
                onClick={handleSignOut}
                className="px-6 py-3 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 text-black dark:text-white hover:bg-amber-100 dark:hover:bg-gray-800 font-semibold rounded-xl transition-all duration-300 hover:transform hover:scale-105"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Status Messages */}
          <div className="mt-6 text-center">
            {error && (
              <p className="text-red-600 dark:text-red-400 font-semibold">
                {error.message || 'Something went wrong!'}
              </p>
            )}
            {updateSuccess && (
              <p className="text-green-600 dark:text-green-400 font-semibold">
                Profile updated successfully!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
