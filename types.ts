export type Msg = {
  subject: string;
  text: string;
};

export type FullMsg = Msg & {
  device: string;
  problem: string;
  sn: string;
};

export type QWENResponse = {
  message: {
    role: string;
    content: string;
  };
};
