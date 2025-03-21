import { Box } from "@mui/material";

type UserImageProps = {
  image: string;
  size?: string;
};

const UserImage = ({ image, size = "60px" }: UserImageProps) => {
  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"
        src={`${image}`}
      />
    </Box>
  );
};

export default UserImage;
