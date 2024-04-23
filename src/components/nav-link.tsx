import { ComponentProps } from "react"

interface NavLink extends ComponentProps<'a'> {
    children: string
}
export function NavLink(props: NavLink){
    return (
        <a {...props} className='font-medium text-sm'>{props.children}</a>
    )
}