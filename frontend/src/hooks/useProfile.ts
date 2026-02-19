import { getUserProfile } from "@/api";
import { IUser } from "@/types/user";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export function useProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<IUser | null>(null);

  async function fetchProfile() {
    setIsLoading(true);
    try {
      const response = await getUserProfile();

      if (response) {
        setProfile(response);
      }
    } catch (error) {
      toast.error("Erro ao buscar perfil do usuário");
      console.error("Erro ao buscar perfil do usuário:", error);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  return { profile, isLoading, fetchProfile };
}

