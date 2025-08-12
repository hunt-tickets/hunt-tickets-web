"use client";
import LoaderAudio from "@/components/site/LoaderAudio";
import { useEffect, useState } from "react";

const AboutUsPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // First show loader for 2 seconds
    const loaderTimer = setTimeout(() => {
      setIsLoading(false);

    }, 2000);

    return () => clearTimeout(loaderTimer);
  }, []);

  if (isLoading) {
    return <LoaderAudio />;
  }

  return (
    <>

      <div className="flex w-full items-center justify-center gap-12 bg-default-background px-6 py-32">
        <div className="flex flex-col md:flex-row w-full items-center justify-center gap-12">
          <div className="flex w-56 flex-none items-center gap-2 self-stretch px-1 py-1">
            <span className="font-['Source_Sans_3'] text-[20px] font-[400] leading-[24px] text-default-font">
              Hunt es una comunidad Hunt es un amigo Hunt es una experienica
            </span>
          </div>
          <div className="flex max-w-[768px] grow shrink-0 basis-0 flex-col items-start gap-4">
            <span className="w-full max-w-[1024px] whitespace-pre-wrap font-['Montserrat'] text-[60px] font-[900] leading-[84px] text-brand-800 -tracking-[0.04em] mobile:font-['Montserrat'] mobile:text-[72px] mobile:font-[900] mobile:leading-[68px] mobile:tracking-normal">
              {"SOBRE NOSOTROS"}
            </span>
            <span className="w-full max-w-[768px] whitespace-pre-wrap font-['Source_Sans_3'] text-[20px] font-[300] leading-[26px] text-brand-800 -tracking-[0.015em]">
              {
                "En Hunt creemos que cada persona merece vivir experiencias únicas. Estamos hechos para ayudarte a descubrir los mejores eventos de tu ciudad, dependiendo de tus gusto. Queremos que encuentres planes increíbles con facilidad y seguridad todo desde una sola app.\n"
              }
            </span>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-none flex-col items-center justify-center gap-6 bg-default-background px-6 py-32">
        <div className="flex w-full max-w-[1280px] flex-col items-start gap-12">
          <span className="w-full max-w-[576px] font-['Montserrat'] text-[50px] font-[700] leading-[56px] text-brand-900 -tracking-[0.025em]">
            ¿QUIÉNES SOMOS?
          </span>
        </div>
        <div className="flex w-full max-w-[1280px] flex-none flex-wrap items-center justify-center rounded-[32px] bg-neutral-100">
          <div className="flex h-112 min-w-[320px] grow shrink-0 basis-0 flex-col items-center justify-center gap-2 rounded-[32px] bg-[#a3a3a3ff] px-12 py-12">
            <img
              className="grow shrink-0 basis-0 object-contain"
              src="https://res.cloudinary.com/subframe/image/upload/v1743719637/uploads/4760/nt867gpdkdqejy97btr8.png"
            />
          </div>
          <div className="flex grow shrink-0 basis-0 flex-col items-start justify-center gap-12 px-12 py-12">
            <span className="whitespace-pre-wrap font-['Montserrat'] text-[18px] font-[400] leading-[26px] text-subtext-color -tracking-[0.01em]">
              {
                "Somos una comunidad que conecta personas con momentos. Trabajamos de la mano con artistas, productores y espacios locales para ofrecerte una selección curada y una experiencia personalizada. En Hunt puedes comprar, transferir, guardar y acceder a tus entradas en segundos.\n"
              }
            </span>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-12 bg-default-background px-6 py-16">
        <div className="flex w-full max-w-[768px] flex-col items-start gap-4">
          <span className="w-full font-['Montserrat'] text-[36px] font-[700] leading-[40px] text-brand-900 text-center -tracking-[0.02em]">
            NUESTRA MISIÓN
          </span>
          <span className="whitespace-pre-wrap font-['Montserrat'] text-[18px] font-[400] leading-[26px] text-default-font text-center -tracking-[0.01em]">
            {
              "Queremos transformar la forma en la que disfrutas tu ciudad. Apostamos por una cultura de eventos más cercana, diversa y memorable. Por eso, creamos herramientas que mejoran tanto tu experiencia como la de los organizadores, impulsando una escena cultural más conectada. Si hay algo pasando, está en Hunt.\n"
            }
          </span>
        </div>
        <div className="flex w-full max-w-[1280px] flex-wrap items-center justify-center gap-6 mobile:flex-col mobile:flex-wrap mobile:gap-6">
          <div className="flex min-w-[320px] grow shrink-0 basis-0 flex-col items-start justify-end gap-8 self-stretch rounded-[32px] bg-neutral-100 px-8 py-8">
            <div className="flex w-full grow shrink-0 basis-0 flex-col items-start justify-end gap-6">
              <span className="w-full max-w-[448px] whitespace-pre-wrap font-['Montserrat'] text-[35px] font-[900] leading-[44px] text-brand-900 -tracking-[0.04em] mobile:font-['Montserrat'] mobile:text-[40px] mobile:font-[900] mobile:leading-[40px] mobile:tracking-normal">
                {"AUTENTICIDAD"}
              </span>
              <span className="w-full max-w-[576px] whitespace-pre-wrap font-['Montserrat'] text-[18px] font-[400] leading-[26px] text-default-font -tracking-[0.01em]">
                {"Te mostramos lo que nos gusta, como nos gusta vivirlo.\n"}
              </span>
            </div>
          </div>
          <div className="flex min-w-[320px] grow shrink-0 basis-0 flex-col items-start justify-end gap-8 self-stretch rounded-[32px] bg-neutral-100 px-8 py-8">
            <div className="flex w-full grow shrink-0 basis-0 flex-col items-start justify-end gap-6">
              <span className="w-full max-w-[448px] whitespace-pre-wrap font-['Montserrat'] text-[35px] font-[900] leading-[44px] text-brand-900 -tracking-[0.04em] mobile:font-['Montserrat'] mobile:text-[40px] mobile:font-[900] mobile:leading-[40px] mobile:tracking-normal">
                {"CERCANÍA"}
              </span>
              <span className="w-full max-w-[576px] whitespace-pre-wrap font-['Montserrat'] text-[18px] font-[400] leading-[26px] text-default-font -tracking-[0.01em]">
                {"Queremos que usar Hunt se sienta natural, simple y cómodo.\n"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex h-60 w-full flex-none flex-col items-center justify-center gap-12 bg-neutral-100 px-6 py-32">
          <div className="flex w-full max-w-[1280px] flex-col items-start gap-2">
            <span className="w-full font-['Montserrat'] text-[35px] font-[700] leading-[40px] text-default-font text-center -tracking-[0.02em]">
              TU CIUDAD, TUS GUSTOS, TUS PLANES
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUsPage;
