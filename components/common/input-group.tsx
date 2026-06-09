import { type PropsWithChildren } from "react";

const InputGroup = ({children}:PropsWithChildren) => {
  return (
    <div className="flex items-center gap-5 w-full">
     {children}
    </div>
  )
}

export default InputGroup;