"use client";

import DrawerProfileCreate from "@/components/form/DrawerProfileCreate";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import FilteredProducersList from "@/components/site/FilteredProducersList";
import ProducersList from "@/components/site/ProducersList";
import ProducersListNew from "@/components/site/ProducersListNew";
import TitleSection from "@/components/site/TitleSection";
import Toolbar from "@/components/site/Toolbar";
import { useProducers } from "@/hook/useProducers";
import { useUser } from "@/lib/UserContext";
import {
  getLatestProducers,
} from "@/supabase/producersService";
import { getProfiles } from "@/supabase/profilesService";
import { Producer } from "@/types/site";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { user, loading: userLoading } = useUser();
  const [profile, setProfile] = useState<any>(null);
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [latestProducers, setLatestProducers] = useState<Producer[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const { producers, loading, setSearchTerm, setSortOrder, searchTerm } =
    useProducers();

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };


  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      setLoadingProfile(true);
      const profiles = await getProfiles();
      const userProfile = profiles.find((p: any) => p.id === user.id);
      setProfile(userProfile || {});
      setLoadingProfile(false);
    };
    fetchProfile();
  }, [user]);


  useEffect(() => {
    const fetchLatestProducers = async () => {
      setLoadingProfile(true);
      const { data, error } = await getLatestProducers();
      if (error) {
        console.log("Error fetching latest producers:", error);
        setLatestProducers([]);
      } else {
        setLatestProducers(data || []);
      }
      setLoadingProfile(false);
    };

    fetchLatestProducers();
  }, []);

  const handleProducerDrawer = () => {
    setIsOpenCreate(true);
  };

  if (userLoading || loadingProfile) {
    return <p className="text-center text-lg">Cargando...</p>;
  }

  return (
    <div className="flex h-full w-full flex-col items-start gap-10 bg-default-background px-6 py-12">
      <div className="flex flex-col items-start gap-4">
        <Breadcrumbs />
        <TitleSection title="Productores" />
      </div>
      <Toolbar
        title="Productores"
        onSearch={handleSearch}
      />
      <div className="flex w-full flex-col items-start gap-3">
        {searchTerm === "" ? (
          <>
            <ProducersListNew producers={latestProducers} loading={loading} />
          </>
        ) : (
          <FilteredProducersList
            producers={producers}
            searchTerm={searchTerm}
            sortOrder={undefined}
            loading={loading}
          />
        )}
      </div>
      <DrawerProfileCreate
        open={isOpenCreate}
        close={() => setIsOpenCreate(false)}
      />
    </div>
  );
}
