import {useEffect, useState} from "react";
import useDialogStore from "@/store/dialog-jackpot";
import {Dialog, DialogContent} from "@/components/ui/dialog";
import McRoulette from "@/components/roulette-item/mc-roulette";
import useEmployeeStore from "@/store/employee-store";
import {data} from "framer-motion/m";

export default function Jackpot() {
  const transitionDuration = 6;
  const {employees} = useEmployeeStore();
  const {isOpen, closeDialog, dialogData} = useDialogStore()
  const [dataRes, setDataRes] = useState<any[]>([]);
  console.log(dialogData);
  useEffect(() => {
    setDataRes(employees.filter(item => item.department === dialogData?.department || ""))
  }, [dialogData]);
  return (
    <Dialog open={isOpen} onOpenChange={(value) => !value && closeDialog()}>
      <DialogContent className="bg-transparent w-full max-w-none border-none shadow-none">
        <McRoulette
          weapons={dataRes}
          weaponsCount={Math.max(data.length * 4, 20)}
          transitionDuration={transitionDuration}
        />
      </DialogContent>
    </Dialog>

  )
}