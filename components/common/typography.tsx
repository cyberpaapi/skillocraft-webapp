import { cn } from '@/lib/utils'
import { VariantProps, cva } from 'class-variance-authority'
import { ReactNode, type FC } from 'react'

interface Props extends VariantProps<typeof typographyVariants> {
type:string,
className?:string,
children:ReactNode,

}

const typographyVariants = cva(
    "text-base font-medium font-sans text-primary",
    {
      variants: {
        variant: {
          default: "text-base font-medium font-sans text-primary",
          italic:"italic font-regular uppercase",
          heading:"font-sen font-bold"
        },
        size: {
          default: "text-sm xl:text-base",
          xs:"text-xs",
          sm: "text-sm",
          lg: "text-base xl:text-lg",
          xl: "text-xl",
          '2xl' : "text-lg lg:text-xl xl:text-2xl",
          '3xl' : "text-xl lg:text-2xl xl:text-3xl",
          '4xl' : "text-2xl lg:text-3xl xl:text-4xl",
          '5xl' : "text-3xl lg:text-4xl xl:text-5xl",
          '6xl' : "text-4xl lg:text-5xl xl:text-6xl",
        },
      },
      defaultVariants: {
        variant: "default",
        size: "default",
      },
    }
  )

const Typography: FC<Props> = ({type,className,variant,size,children}) => {
    switch (type) {
        case "h1":
          return <h1 className={cn(typographyVariants({variant,size,className}))}>{children}</h1>;
        case "h2":
          return <h2 className={cn(typographyVariants({variant,size,className}))}>{children}</h2>;
        case "h3":
          return <h3 className={cn(typographyVariants({variant,size,className}))}>{children}</h3>;
        case "h4":
          return <h4 className={cn(typographyVariants({variant,size,className}))}>{children}</h4>;
        case "h5":
          return <h5 className={cn(typographyVariants({variant,size,className}))}>{children}</h5>;
        case "p":
          return <p className={cn(typographyVariants({variant,size,className}))}>{children}</p>;
        default:
          return <p className={cn(typographyVariants({variant,size,className}))}>{children}</p>;
      }
}

export default Typography;