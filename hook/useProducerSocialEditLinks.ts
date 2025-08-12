import {
  addProducerSocialLink,
  getProducerLinks,
  updateProducerSocialLink,
} from "@/supabase/producersService";
import { SocialMedia } from "@/types/site";
import { useEffect, useState } from "react";

export const useProducerSocialEditLinks = (producerId: string) => {
  const [socialLinks, setSocialLinks] = useState<SocialMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSocialLinks = async () => {
    setLoading(true);
    const { data, error } = await getProducerLinks(producerId);
    if (error) {
      setError(error);
    } else {
      setSocialLinks(
        data?.map((social) => ({
          id: social.id,
          social_media_id: social.social_media_id,
          link: social.link,
          name: social.name,
          icon: social.icon,
        })) || []
      );
    }
    setLoading(false);
  };

  const saveSocialLink = async ({
    producer_id,
    social_media_id,
    name,
    link,
  }: {
    producer_id: string;
    social_media_id: string;
    name: string;
    link: string;
  }) => {
    setLoading(true);
    const existingSocial = socialLinks.find(
      (item) => item.social_media_id === social_media_id
    );

    let response;
    if (existingSocial) {
      response = await updateProducerSocialLink(existingSocial.id, link);
    } else {
      response = await addProducerSocialLink({
        producer_id,
        social_media_id,
        link,
      });
    }

    if (response.success) {
      fetchSocialLinks();
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSocialLinks();
  }, [producerId]);

  return { socialLinks, fetchSocialLinks, saveSocialLink, loading, error };
};
