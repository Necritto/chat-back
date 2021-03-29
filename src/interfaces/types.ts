export interface ObjectIdInterface extends ObjectInterface, PureObjectIdInterface {}

export interface PureObjectIdInterface {
  id: string;
}

export interface ObjectInterface {
  [key: string]: any;
}

export interface RequestInterface {
  body: ObjectInterface;
  params: ObjectInterface;
  query: ObjectInterface;
  user?: ObjectIdInterface;
}
