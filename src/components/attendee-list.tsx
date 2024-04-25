import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import relativeTime from 'dayjs/plugin/relativeTime'
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal, Search} from 'lucide-react'
import { IconButton } from './icon-button'
import { Table } from './table/table'
import { TableHeader } from './table/table-header'
import { TableCell } from './table/table-cell'
import { TableRow } from './table/table-row'
import { ChangeEvent, useEffect, useState } from 'react'
// import { Attendees } from '../data/attendees' 

dayjs.extend(relativeTime)
dayjs.locale('pt-br')

interface Attendee {
    id: string,
    name: string,
    email: string,
    createdAt: string,
    checkedInAt: string | null,
}

export function AttendeeList() {
    
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [attendees, setAttendees] = useState<Attendee[]>([])
    const qtyByPage = 10
    const totalPages = Math.ceil((attendees.length)/qtyByPage)

    useEffect(() => {
        fetch('http://localhost:3333/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees')
        .then(response => response.json())
        .then(data => {
            setAttendees(data.attendees)
        })
    }, [page])

    function OnSearchInputChange(event: ChangeEvent<HTMLInputElement>) {
        setSearch(event.target.value)
    }

    function GoToFirstPage(){
        setPage(1)
    }

    function GoBackOnePage(){
        setPage(page - 1)
    }

    function GoToNextPage(){
        setPage(page + 1)
    }

    function GoToLastPage(){
        setPage(totalPages)
    }

    return (
        <div className='flex flex-col gap-4'>
            <div className="flex gap-3 items-center">
                <h1 className="text-2xl font-bold">Participantes</h1>
                <div className="px-3 py-1.5 border border-white/10 rounded-lg text-sm w-72 flex items-center gap-3">
                    <Search className='size-4 text-emerald-300' />
                    <input onChange={OnSearchInputChange} className="bg-transparent flex-1 outline-none" placeholder="Buscar participante"/>
                </div>
                {search}
            </div>            
            <Table>
                <thead>
                    <tr className='border-b border-white/10'>
                        <TableHeader style={{ width: 48 }} >
                            <input type='checkbox'/>
                        </TableHeader>
                        <TableHeader>Código</TableHeader>
                        <TableHeader>Participante</TableHeader>
                        <TableHeader>Data de Incrição</TableHeader>
                        <TableHeader>Data do check-in</TableHeader>
                        <TableHeader style={{ width: 64 }} ></TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {attendees.map((attendee) => {
                        return (
                            <TableRow key={attendee.id} >
                                <TableCell>
                                    <input type='checkbox' />
                                </TableCell>
                                <TableCell>{attendee.id}</TableCell>
                                <TableCell>
                                    <div className='flex flex-col gap-1'>
                                        <span className='font-semibold text-white'>{attendee.name}</span>
                                        <span>{attendee.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{dayjs().to(attendee.createdAt)}</TableCell>
                                <TableCell>{
                                    attendee.checkedInAt === null 
                                    ? <span className='text-zinc-400'> Não fez check-in </span>
                                    : dayjs().to(attendee.checkedInAt)}
                                </TableCell>
                                <TableCell>
                                    <IconButton transparent={true}>
                                        <MoreHorizontal className='size-4' />
                                    </IconButton >
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </tbody>
                <tfoot>
                    <tr>
                        <TableCell colSpan={3}>
                            Mostrando {
                                attendees.length < qtyByPage //Se total de registros for menor que qtd por página
                                ? attendees.length // mostre a total de registros
                                : qtyByPage // senão, mostre a qtd por página
                                } de {attendees.length} itens
                        </TableCell>
                        <TableCell className={'text-right'} colSpan={3}>
                            <div className='inline-flex items-center gap-8'>
                                <span>Página {page} de {totalPages}</span>
                                <div className='flex gap-1.5'>
                                    <IconButton onClick={GoToFirstPage} disabled={page === 1}>
                                        <ChevronsLeft className='size-4' />
                                    </IconButton>
                                    <IconButton onClick={GoBackOnePage} disabled={page === 1}>
                                        <ChevronLeft className='size-4' />
                                    </IconButton>
                                    <IconButton onClick={GoToNextPage} disabled={page === totalPages}>
                                        <ChevronRight className='size-4' />
                                    </IconButton>
                                    <IconButton onClick={GoToLastPage} disabled={page === totalPages}>
                                        <ChevronsRight className='size-4' />
                                    </IconButton>
                                </div>
                            </div>
                        </TableCell>
                    </tr>
                </tfoot>
            </Table>            
        </div>
    )
}