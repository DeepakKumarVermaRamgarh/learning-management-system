import React, { FC, useState, useEffect } from "react";

type Props = {
  videoUrl: string;
  title: string;
};

const CoursePlayer: FC<Props> = ({ videoUrl, title }) => {
  const [videoData, setVideoData] = useState({
    otp: "",
    playbackInfo: "",
  });

  useEffect(() => {
    const getVideoUrl = async () => {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}getVdoCipherOTP`,
        { videoId: videoUrl }
      );
      setVideoData(data);
    };
    getVideoUrl();
  }, [videoUrl]);

  return (
    <div className=" pt-[41%] relative">
      {videoData.otp && videoData.playbackInfo !== "" && (
        <iframe
          src={`https://player.vdocipher.com/v2/?otp=${videoData.otp}&playbackInfo=${videoData.playbackInfo}&player=${process.env.NEXT_PLAYER_ID}`}
          className=" border-none w-[90%] h-full absolute top-0 left-0 "
          allowFullScreen={true}
          allow="encrypted-media"
        ></iframe>
      )}
    </div>
  );
};

export default CoursePlayer;
