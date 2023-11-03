import React, { FC, useState, useEffect } from "react";
import axios from "axios";

type Props = {
  videoUrl: string;
  title: string;
};
// sample video url = 461f8bce79ccae5f5d820abf57612f44
const CoursePlayer: FC<Props> = ({ videoUrl = "", title }) => {
  const [videoData, setVideoData] = useState({
    otp: "",
    playbackInfo: "",
  });

  useEffect(() => {
    const getVideoUrl = async () => {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}getVdoCipherOTP`,
        { videoId: videoUrl }
      );
      setVideoData(data);
    };
    getVideoUrl();
  }, []);

  return (
    <div className=" pt-[56.25%] relative overflow-hidden">
      {videoData && videoData?.otp && videoData?.playbackInfo !== "" && (
        <iframe
          src={`https://player.vdocipher.com/v2/?otp=${videoData?.otp}&playbackInfo=${videoData?.playbackInfo}`}
          className=" border-none w-full h-full absolute top-0 left-0 "
          allowFullScreen={true}
          allow="encrypted-media"
        ></iframe>
      )}
    </div>
  );
};

export default CoursePlayer;
