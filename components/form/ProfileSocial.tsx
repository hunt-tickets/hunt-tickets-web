import { useProducerSocialEditLinks } from "@/hook/useProducerSocialEditLinks";
import {
  addProducerSocialLink,
  updateProducerSocialLink,
} from "@/supabase/producersService";
import { SocialMedia } from "@/types/site";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import FormInput from "../site/FormInput";
import { Button } from "../sub/button";

type ProfileSocialProps = {
  close: () => void;
  producerId: string;
  socialMediaList: SocialMedia[];
};

const profileSocialValidationSchema = Yup.object().shape({
  pageWeb: Yup.string().url("La URL no es válida"),
  instagram: Yup.string().url("La URL no es válida"),
  whatsapp: Yup.string().url("La URL no es válida"),
  youtube: Yup.string().url("La URL no es válida"),
  tiktok: Yup.string().url("La URL no es válida"),
  soundcloud: Yup.string().url("La URL no es válida"),
  spotify: Yup.string().url("La URL no es válida"),
});

const ProfileSocial = ({
  close,
  producerId,
  socialMediaList,
}: ProfileSocialProps) => {
  const { socialLinks, fetchSocialLinks, saveSocialLink, loading, error } =
    useProducerSocialEditLinks(producerId);

  const socialPlatforms = [
    { name: "Página Web", id: "f56b0db9-9fbb-42f9-b3f7-ad1829cd4478" },
    { name: "Instagram", id: "ab61cce8-2b5c-4a90-9931-24ef9201dcb3" },
    { name: "WhatsApp", id: "e4960eb9-e8f2-4f9a-a1b7-ce31de4b07bf" },
    { name: "YouTube", id: "178cc47d-0fb7-420d-9cfd-bc68e243211c" },
    { name: "TikTok", id: "dcfdbbce-3e31-47ea-89aa-e878de72a259" },
    { name: "SoundCloud", id: "5b688a64-df76-4bde-a1fe-4c346d3b921e" },
    { name: "Spotify", id: "f0f70ff8-9348-4b93-9811-0416e613b18f" },
  ];

  const initialValues = socialPlatforms.reduce((acc, platform) => {
    const socialMedia = socialMediaList.find(
      (item) =>
        item.name && item.name.toLowerCase() === platform.name.toLowerCase()
    );
    acc[platform.name.toLowerCase()] = socialMedia?.link?.toString() || "";
    return acc;
  }, {} as Record<string, string>);
  const handleSubmit = async (values: typeof initialValues) => {
    for (const platform of socialPlatforms) {
      const link = values[platform.name.toLowerCase()];

      if (link) {
        const existingSocial = socialLinks.find(
          (item) => item.social_media_id === platform.id
        );

        if (existingSocial && existingSocial.id) {
          await updateProducerSocialLink(existingSocial.id, link);
        } else {
          await addProducerSocialLink({
            producer_id: producerId,
            social_media_id: platform.id,
            link,
          });
        }
      }
    }
    fetchSocialLinks();
    close();
  };

  return (
    <div className="flex w-full flex-col items-start gap-4">
      <Formik
        initialValues={initialValues}
        validationSchema={profileSocialValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="flex w-full flex-col items-start gap-6">
            <div className="flex w-full flex-col items-start rounded-md border border-solid border-neutral-border bg-default-background px-4 py-4 shadow-sm">
              <div className="flex w-full flex-col items-start gap-6">
                {socialPlatforms.map((platform) => (
                  <FormInput
                    key={platform.id}
                    label={platform.name}
                    name={platform.name.toLowerCase()}
                  />
                ))}
              </div>
            </div>
            <div className="flex w-full flex-wrap items-center justify-end gap-2">
              <Button variant="neutral-secondary" onClick={close}>
                Cancelar
              </Button>
              <div className="flex items-center justify-end gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Guardando..." : "Confirmar"}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProfileSocial;
