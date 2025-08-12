import { Audio } from "react-loader-spinner";

const LoaderAudio = () => {
  return (
    <div className="flex h-[550vh] md:h-[100vh] w-screen items-center justify-center">
      <Audio
        height="50"
        width="50"
        color="#FFF"
        ariaLabel="audio-loading"
        wrapperStyle={{}}
        wrapperClass="wrapper-class"
        visible={true}
      />
    </div>
  );
};

export default LoaderAudio;
