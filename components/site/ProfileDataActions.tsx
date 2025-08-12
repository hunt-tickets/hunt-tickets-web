import { Button } from "@/components/sub/button";
import { IconButton } from "@/components/sub/iconButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SocialMedia } from "@/types/site";
import { IconName } from "@subframe/core";
import CircularIconButton from "../sub/CircularIconButton";

type ProfileDataActionsProps = {
  name: string;
  email: string;
  onEditProducer: () => void;
  onEditLegal: () => void;
  onEditSocial: () => void;
  onEditAdminPanel: () => void;
  socialMediaList: SocialMedia[];
};

const ProfileDataActions = ({
  name,
  email,
  onEditProducer,
  onEditLegal,
  onEditSocial,
  onEditAdminPanel,
  socialMediaList,
}: ProfileDataActionsProps) => {
  return (
    <div className="flex w-full items-center justify-between gap-6 p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/15 to-white/5 border border-white/20 shadow-xl">
      <div className="flex grow shrink-0 basis-0 flex-col items-start justify-center">
        <div className="flex w-full items-center gap-4">
          <div className="flex grow shrink-0 basis-0 flex-wrap items-start gap-4 rounded-xl p-4 bg-black/10 backdrop-blur-sm border border-white/10">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {name}
                </h2>
              </div>
              <div className="flex grow shrink-0 basis-0 items-center self-stretch gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-200 cursor-pointer border border-white/10">
                        <IconButton icon="FeatherMail" className="text-white" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-black/80 backdrop-blur-sm border border-white/20">
                      <p className="text-white">{email}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <div className="flex w-px h-8 bg-gradient-to-b from-transparent via-white/30 to-transparent" />
                
                <div className="flex items-center gap-2">
                  {socialMediaList.map((socialMedia) => {
                    const icon = (() => {
                      switch (socialMedia.name) {
                        case "TikTok":
                          return "FeatherMusic";
                        case "Youtube":
                          return "FeatherYoutube";
                        case "Instagram":
                          return "FeatherInstagram";
                        case "Facebook":
                          return "FeatherFacebook";
                        case "WhatsApp":
                          return "FeatherMessageCircle";
                        case "SoundCloud":
                          return "FeatherMic2";
                        case "Página Web":
                          return "FeatherGlobe";
                        case "Spotify":
                          return "FeatherFileAudio";
                        default:
                          return "FeatherAlertCircle";
                      }
                    })();
                    
                    const getGradientColors = (name: string) => {
                      switch (name) {
                        case "Instagram":
                          return "from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30";
                        case "Facebook":
                          return "from-blue-600/20 to-blue-400/20 hover:from-blue-600/30 hover:to-blue-400/30";
                        case "TikTok":
                          return "from-black/20 to-red-500/20 hover:from-black/30 hover:to-red-500/30";
                        case "Youtube":
                          return "from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30";
                        default:
                          return "from-gray-500/20 to-gray-400/20 hover:from-gray-500/30 hover:to-gray-400/30";
                      }
                    };

                    return (
                      <TooltipProvider key={socialMedia.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${getGradientColors(socialMedia.name)} transition-all duration-200 cursor-pointer border border-white/10 hover:scale-105`}>
                              <IconButton
                                icon={icon as IconName}
                                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                                  window.open(socialMedia.link.toString(), "_blank");
                                }}
                                className="text-white"
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-black/80 backdrop-blur-sm border border-white/20">
                            <p className="text-white">{socialMedia.link.toString()}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                  
                  <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-200 cursor-pointer border border-white/10 hover:scale-105">
                    <IconButton
                      variant="brand-tertiary"
                      size="small"
                      onClick={onEditSocial}
                      className="text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center gap-3 self-stretch">
        <div className="flex w-full items-center justify-end gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-200 border border-white/10 hover:scale-105">
            <CircularIconButton icon="FeatherEdit2" onClick={onEditProducer} />
          </div>
          
          <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 transition-all duration-200 border border-white/10 hover:scale-105">
            <CircularIconButton icon="FeatherLandmark" onClick={onEditLegal} />
          </div>
          
          <Button
            disabled={false}
            variant="neutral-primary"
            size="medium"
            icon="FeatherBarChart2"
            iconRight={null}
            loading={false}
            onClick={onEditAdminPanel}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-none shadow-lg text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105"
          >
            Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDataActions;
