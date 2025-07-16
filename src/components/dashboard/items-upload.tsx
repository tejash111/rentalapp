"use client"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { PackagePlus, Plus, Upload } from 'lucide-react'
import { useState } from 'react'
import { DialogTitle } from '@radix-ui/react-dialog'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Select, SelectItem, SelectValue,SelectContent,SelectTrigger } from '../ui/select'
import { Label } from '../ui/label'

type Category={
    id:number;
    name:string;
    createdAt: Date;
}

type CloudinarySignature={
    signature : string;
    timestamp : number;
    apiKey :string;
}

type FormState = {
  title: string;
  description: string;
  location: string;
  categoryId: number | null;
  image: File | null;
};


interface UploadDialogProps{
    categories : Category[]
}


const UploadItems = ({categories} :UploadDialogProps) => {
    const [open,setOpen]=useState(false)
    const [isUploading,setIsUploading]=useState(false)
    const [uploadProgress,setUplaodProgress]=useState(0)
    const [formState,setFormState]=useState<FormState>({
        title: '',
        description: '',
        location: '',
        categoryId: null,
        image: null
    })

    const handleInputChange = (e : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
        const {name,value}=e.target
        setFormState(prev=>({...prev, [name] : value}))
    }
    const handleFileChange = (e : React.ChangeEvent<HTMLInputElement >)=>{
        const  file = e.target.files?.[0]
        if (file){
            setFormState(prev=>({...prev,image:file}))
        }
    }

    const handleCategoryChange=(value:string)=>{
        setFormState((prev)=>({...prev, categoryId : Number(value)}))
    }
    console.log(formState);

    async function getCloudinarySignature(): Promise<CloudinarySignature>{
        const timestamp = Math.round(new Date().getTime()/1000);

        const response = await fetch('/api/cloudinary/signature',{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({timestamp})
        })

        if (!response.ok){
            throw new Error('Faled to create cloudinary Signature');
        }

        return response.json();
    }

    const handleUploadSubmit= async(event : React.FormEvent)=>{
        event.preventDefault()
        setIsUploading(true)
        setUplaodProgress(0)
        try {
            const {signature,apiKey,timestamp} = await getCloudinarySignature();

            const cloudinaryData = new FormData();
            cloudinaryData.append('file',formState.image as File)
            cloudinaryData.append('api_key',apiKey)
            cloudinaryData.append('timestamp',timestamp.toString())
            cloudinaryData.append('signature',signature)
            cloudinaryData.append('folder',"rental-app")

            const xhr = new XMLHttpRequest()
            xhr.open('POST',`https://api.cloudinary.com/v1_1/dr1gpbjgg/auto/upload`)

            xhr.upload.onprogress=(event)=>{
                if (event.lengthComputable){
                    const progress = Math.round((event.loaded/event.total)*100)
                    setUplaodProgress(progress)
                }
            }

            const cloudinaryPromise = new Promise<any>((resolve,reject)=>{
                xhr.onload = ()=>{
                    if (xhr.status >= 200 && xhr.status<300){
                        const response = JSON.parse(xhr.responseText)
                    }else{
                        reject(new Error('upload to cloudinary failed'))
                    } 
                }
                xhr.onerror = ()=>reject(new Error('upload ot cloudinary failed'))
            })

            xhr.send(cloudinaryData)

            const cloudinaryResponse = await cloudinaryPromise;
            const formData= new FormData()
            formData.append('title',formState.title)
            formData.append('categoryId',String(formState.categoryId))
            formData.append('location',formState.location)
            formData.append('description',formState.description)
            formData.append('image',cloudinaryResponse.secure_url)

            //uplaod this to db

        } catch (error) {
            
        }
    }
    
  return (
    
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button variant={'outline'} className='w-full'><Plus className=' w-4 h-4'/> Add Item</Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[600px]'>
            <DialogHeader>
                <DialogTitle>
                    Add Your Item For Rent
                </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUploadSubmit} className='space-y-5 '>
                <div className='space-y-2'>
                    <Label >Title</Label>
                    <Input value={formState.title} onChange={handleInputChange} id='title' name='title' placeholder='Enter Your Item Name'/>
                </div>
                <div className='space-y-2'>
                    <Label >Description</Label>
                    <Textarea onChange={handleInputChange} value={formState.description} id='description' name='description' placeholder='Enter Your Item Description' className='resize-none'/>
                </div>
                  <div className='space-y-2'>
                    <Label >Location</Label>
                    <Input onChange={handleInputChange} value={formState.location} id='location' name='location' placeholder='CV Ramam C-69'/>
                </div>
                <div className='space-y-2'>
                    <Label htmlFor='category'>Category</Label>
                    <Select onValueChange={handleCategoryChange} value={formState.categoryId?.toString()}>
                        <SelectTrigger className='w-full'>
                            <SelectValue placeholder="Select a category"/>
                        </SelectTrigger>
                        <SelectContent>
                            {
                                categories.map(c=>(
                                    <SelectItem key={c.id} value={c.id.toString()}>
                                            {c.name}
                                    </SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                </div>
                  <div className='space-y-2'>
                    <Label htmlFor='image'>Image</Label>
                    <Input onChange={handleFileChange} type='file' id='image' name='image' accept='image/*' />
                </div>
                <DialogFooter>
                    <Button type='submit'><PackagePlus className='mr-2 h-5 w-5'/>Add Item</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
  )
}

export default UploadItems