import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, MapPin, Edit, Save, X, Shield } from "lucide-react";
import { getEncryptedStorage, setEncryptedStorage } from "@/utils/encryption";
import axios from "axios";
import { config } from "@/utils/api";
import { message } from "antd";

// Nigerian states list
const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Federal Capital Territory",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  avatar: string;
  role: string;
}

// Interface for API user data structure based on actual response
interface ApiUserData {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  phone?: string;
  location?: string;
  address?: string;
  state?: string;
  bio?: string;
  created_at?: string;
  createdAt?: string;
  status?: string;
  avatar?: string;
  profile_picture?: string;
  profilePicture?: string;
}

// Interface for update profile payload
interface UpdateProfilePayload {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  state: string;
}

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<ApiUserData | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+234 123 456 7890",
    country: "Nigeria",
    state: "Lagos",
    avatar: "https://github.com/shadcn.png",
    role: "user",
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  // Load user data from localStorage on component mount
  useEffect(() => {
    try {
      const loadedUserData: ApiUserData = getEncryptedStorage("userData");
      console.log("[Profile] Retrieved user data:", loadedUserData);

      if (loadedUserData) {
        setUserData(loadedUserData);

        // Update profile with real user data
        const updatedProfile: UserProfile = {
          firstName: loadedUserData.firstName || "User",
          lastName: loadedUserData.lastName || "",
          email: loadedUserData.email || "user@example.com",
          phone: loadedUserData.phone || "07067206984",
          country:
            loadedUserData.location || loadedUserData.address || "Nigeria",
          state: loadedUserData.state || "Lagos",
          avatar: "https://github.com/shadcn.png",
          role: loadedUserData.role || "user",
        };

        console.log(
          "[Profile] Updated profile with user data:",
          updatedProfile
        );
        setProfile(updatedProfile);
        setEditedProfile(updatedProfile);
      } else {
        console.log("[Profile] No user data found, using default profile");
      }
    } catch (error) {
      console.error("[Profile] Error loading user data:", error);
    }
  }, []);

  const handleSave = async () => {
    if (!userData?.id) {
      message.error("User ID not found. Please log in again.");
      return;
    }

    setIsLoading(true);

    try {
      // Create update payload
      const updatePayload: UpdateProfilePayload = {
        userId: userData.id,
        firstName: editedProfile.firstName,
        lastName: editedProfile.lastName,
        email: editedProfile.email,
        phone: editedProfile.phone,
        country: editedProfile.country,
        state: editedProfile.state,
      };

      console.log("[Profile] Update payload being sent:", updatePayload);
      console.log("[Profile] User ID:", userData.id);

      // Make API call to update profile
      const response = await axios.patch(
        `${config.apiBaseUrl}${config.endpoints.updateProfile}`,
        updatePayload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("[Profile] Update response:", response.data);

      if (response.data) {
        // Update local profile state
        setProfile(editedProfile);

        // Update stored user data
        const updatedUserData = {
          ...userData,
          firstName: editedProfile.firstName,
          lastName: editedProfile.lastName,
          email: editedProfile.email,
          phone: editedProfile.phone,
          location: editedProfile.country,
          state: editedProfile.state,
        };

        console.log("[Profile] Updating stored user data:", updatedUserData);
        setEncryptedStorage("userData", updatedUserData);
        setUserData(updatedUserData);

        message.success("Profile updated successfully!");
        setIsEditing(false);
      } else {
        message.error("Failed to update profile");
      }
    } catch (error: any) {
      console.error("[Profile] Update error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update profile. Please try again.";

      message.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Profile</h1>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
          className="gap-2"
          disabled={isLoading}
        >
          {isEditing ? (
            <>
              <X className="h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <Edit className="h-4 w-4" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Profile Overview */}
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={profile.avatar}
                  alt={`${profile.firstName} ${profile.lastName}`}
                />
                <AvatarFallback className="text-3xl">
                  {profile.firstName[0]}
                  {profile.lastName[0]}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl">
              {profile.firstName} {profile.lastName}
            </CardTitle>
            <CardDescription className="text-muted-foreground uppercase text-sm">
              {profile.role}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{profile.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{profile.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>
                {profile.state}, {profile.country}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span className="capitalize">{profile.role}</span>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              {isEditing
                ? "Update your personal information"
                : "Your personal information"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                {isEditing ? (
                  <Input
                    id="firstName"
                    value={editedProfile.firstName}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        firstName: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p className="text-sm">{profile.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                {isEditing ? (
                  <Input
                    id="lastName"
                    value={editedProfile.lastName}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        lastName: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p className="text-sm">{profile.lastName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        email: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p className="text-sm">{profile.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={editedProfile.phone}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        phone: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p className="text-sm">{profile.phone}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                {isEditing ? (
                  <Input
                    id="country"
                    value={editedProfile.country}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        country: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p className="text-sm">{profile.country}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                {isEditing ? (
                  <Select
                    value={editedProfile.state}
                    onValueChange={(value) =>
                      setEditedProfile({
                        ...editedProfile,
                        state: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a state" />
                    </SelectTrigger>
                    <SelectContent>
                      {NIGERIAN_STATES.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm">{profile.state}</p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleSave}
                  className="gap-2"
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
