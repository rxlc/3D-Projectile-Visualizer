import React, {useState, useContext, useEffect} from 'react'
import { Card, Text, Tabs, TabPanels, Tab, TabList, TabPanel, Button, useToast, InputGroup, Input, Flex} from '@chakra-ui/react';
import { ExperienceContext } from '../Contexts/ExperienceContext';
import { AngleContext } from '../Contexts/AngleContext';
import { VelContext } from '../Contexts/VelContext';

import FloatingInput from './FloatingInput';

function LaunchPanel() {
    const experience = useContext(ExperienceContext);
    const {angle} = useContext(AngleContext)
    const {vel} = useContext(VelContext)

    const [isHovered, setIsHovered] = useState(false);
    const [editingPos, setEditingPos] = useState(false)
    const [targetPos, setTargetPos] = useState({x:0, y:0, z:0})

    const [pInProgress, setPInProgress] = useState(false);

    const toast = useToast();

    useEffect(() => {
        const handleInvalidInput = () => {
            toast({
              title: 'Unable to launch projectile with given input',
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          };
        
        document.addEventListener('invalidInput', handleInvalidInput);

        return () => {
            document.removeEventListener('invalidInput', handleInvalidInput);
        }
    }, [])

    useEffect(() => {
        if (experience.experience) {
            updatePos();
        }
    },[experience, editingPos])

    function updatePos() {
        const position = experience.experience.world.target.instance.position;
        setTargetPos({x: round(position.x), y: round(position.y), z: round(position.z)})
        requestAnimationFrame(updatePos)
    }

    function setTargetPosX(x) {
        if (experience.experience) {
            setEditingPos(false);   
            experience.experience.world.target.instance.position.x = x
            setTargetPos({...targetPos, x: x})
        }
    }

    function setTargetPosY(y) {
        if (experience.experience) {
            setEditingPos(false);   
            experience.experience.world.target.instance.position.y = y
            setTargetPos({...targetPos, y: y})
        }
    }

    function setTargetPosZ(z) {
        if (experience.experience) {
            setEditingPos(false);   
            experience.experience.world.target.instance.position.z = z
            setTargetPos({...targetPos, z: z})
        }
    }

    function round(num) {
        return Math.floor(num * 100)/100;
    }

    function launchAngle() {
        experience.experience.world.launchAngle(angle)
    }

    function launchVel() {
        experience.experience.world.launchVel(vel)
    }

    return (
        <Card
            position={"fixed"}
            ml="1%"
            width="300px" 
            bg="gray.800"
            opacity={isHovered ? 0.8 : 0.5}
            zIndex={1}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                transition: 'opacity 0.3s ease-in-out',
            }}
            color="white">
                <Text textAlign={"center"} my="14px" fontSize="20px">Launcher Interface</Text>
                <Text my="3px" ml="20px" fontSize="sm" textColor={"gray.400"}>Set target position:</Text>
                <Flex width="95%" ml="8px">
                    <InputGroup flexDirection={"column"} margin="4px">
                        <Text ml="5px" fontSize={"xs"}>x</Text>
                        <Input variant='outline' height="35px" onChange={() => 0} value={editingPos ? null : targetPos.x} onFocus={() => setEditingPos(true)}  onBlur={(event) => setTargetPosX(Number(event.target.value))}/>
                    </InputGroup>
                    <InputGroup flexDirection={"column"} margin="4px">
                        <Text ml="5px" fontSize={"xs"}>y</Text>
                        <Input variant='outline' height="35px" onChange={() => 0} value={editingPos ? null : targetPos.y} onFocus={() => setEditingPos(true)}  onBlur={(event) => setTargetPosY(Number(event.target.value))}/>
                    </InputGroup>
                    <InputGroup flexDirection={"column"} margin="4px">
                        <Text ml="5px" fontSize={"xs"}>z</Text>
                        <Input variant='outline' height="35px" onChange={() => 0} value={editingPos ? null : targetPos.z} onFocus={() => setEditingPos(true)}  onBlur={(event) => setTargetPosZ(Number(event.target.value))}/>
                    </InputGroup>
                </Flex>
                <Text mt="6px" ml="20px" fontSize="sm" textColor={"gray.400"}>Solve using:</Text>
                <Tabs>
                    <TabList>
                        <Tab fontSize={"15px"}>Vertical Angle</Tab>
                        <Tab fontSize={"15px"}>Launch Velocity</Tab>
                    </TabList>
                    <TabPanels p="0px">
                        <TabPanel p="0px" m="0px">
                            <FloatingInput label="Angle" width="150px" height="40px" fontsize="sm" helper="Enter in degrees" mode={1} />
                            <Button colorScheme='teal' variant='solid' onClick={launchAngle} width="100%">
                                Launch
                            </Button>
                        </TabPanel>
                        <TabPanel p="0px" m="0px">
                            <FloatingInput label="Velocity" width="150px" height="40px" fontsize="sm" helper="Enter in m/s" mode={2}/>
                            <Button colorScheme='teal' variant='solid' onClick={launchVel} width="100%">
                                Launch
                            </Button>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
        </Card>
    )
}

export default LaunchPanel;
