"use client"

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import AuthCard from "@/components/ui/AuthCard";
import Divider from "@/components/ui/Divider";
import Logo from "@/components/ui/Logo";
import Loader from "@/components/ui/Loader";
import FormError from "@/components/ui/FormError";
import SocialButton from "@/components/ui/SocialButton";
import Modal from "@/components/ui/Modal";
import Checkbox from "@/components/ui/Checkbox";
import Heading from "@/components/ui/Heading";
import Label from "@/components/ui/Label";

const HomePage = () => {
  return(
    <div>
      <div>
        <Input />
        <Button />
        <AuthCard />
        <Divider />
        <Logo />
        <Loader />
        <FormError />
        <SocialButton />
        <Modal />
        <Checkbox />
        <Heading />
        <Label />
      </div>
    </div>
  )
}

export default HomePage;