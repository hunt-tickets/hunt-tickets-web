const ProfileDescription = ({ description }: { description: string }) => {
  return (
    <div>
      <p className="text-body font-body text-default-font">{description}</p>
    </div>
  );
};

export default ProfileDescription;
