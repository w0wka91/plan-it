type Poll = {
  id?: string;
  title: string;
  creator: {
    name: string;
    email: string;
    updateMe: boolean;
  };
  options: Date[];
};
