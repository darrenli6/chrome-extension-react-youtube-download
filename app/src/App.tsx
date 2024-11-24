import { Button, Center, Container, Heading, Image,Input,InputGroup,InputRightElement,Spinner,Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const App = () => {
    const [url ,setUrl] = useState<string>("");
    const [loading ,setLoading] = useState<boolean>(false);
    const baseUrl = "http://127.0.0.1:5001";
    const handleSubmit = async () =>{
       
        if (!url) return toast.error("Please enter a valid URL");

        setLoading(true); 

        try{
            const data= await axios.post(`${baseUrl}/api/download `,{
                    "url":"https://youtu.be/Y0vW-xrDH30?si=FUXKtF3JEXsdgSgl"  
            });

            console.log(data);
            if(data){
                toast.success("Downloaded Successfully");
                window.location.href =data?.data?.download; // 直接跳转到下载地址
                toast.success("下载开始");
                //window.open(data?.data?.download,"_blank");
            }

        }catch(error:any){
            if(!error?.response){
                toast.error("Something went wrong");
            }
            toast.error(error?.response?.data?.message); 

          }finally{
            setLoading(false);
            setUrl("");
          }
}

    return (
       <Container w="400px" h="auto" mx="auto" p="4">
        <Center>
            <Image src="/icon.png" alt="youtube" w="16"    />
        </Center>
        <Heading textAlign="center" fontWeight="bold" fontSize="lg" mt="2">
            Youtube Video Downloader</Heading>
        <Text>
            youtube video downloader is a simple and easy to use tool that allows you to download youtube videos in mp3 format.
        </Text>   

        <VStack mt={5}>
            <InputGroup w="full" py={1} 
            border="2px" 
            borderColor="origin.100" 
             rounded="md"  >
              <Input pr={24} onChange={(e)=>setUrl(e.target.value)} pl={3} py={3} variant="unstyled"
               fontSize="md"
              type="text" placeholder="Enter Youtube Video Link" />
              <InputRightElement h="full" w="28" p={1}>
                <Button colorScheme="orange" fontSize="sm" onClick={handleSubmit} isLoading={loading} fontWeight="semibold" rounded="sm" >
                  {loading ? <Spinner /> : "Download"}
                </Button>
              </InputRightElement>
            </InputGroup>
        </VStack> 
       </Container>
    )

}

export default App;