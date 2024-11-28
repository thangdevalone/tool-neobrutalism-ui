"use client";
import WheelComponent from "@/components/common/wheel";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Textarea} from "@/components/ui/textarea";
import React, {ChangeEvent, useEffect, useState} from "react";
import * as XLSX from "xlsx";
import {Input} from "@/components/ui/input";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Pause, Play} from "lucide-react";
import {useStore} from "@/store/history";
import {motion} from "framer-motion"

export default function Page() {
  const [value, setValue] = useState("");
  const [lines, setLines] = useState<String[]>([]);
  const [prizes, setPrizes] = useState<
    { id: number; name: string; quantity: number }[]
  >([{id: 1, name: "", quantity: 0}]);
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };
  const {nowPrize, setNowPrize} = useStore()
  const [isAuto, setIsAuto] = useState(false);

  useEffect(() => {
    const line_s = value
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    setLines(line_s as string[]);
  }, [value]);

  useEffect(() => {
    if (!prizes.find(item => item.quantity > 0) && isAuto) {
      setIsAuto(false)
    }
  }, [prizes]);
  useEffect(() => {
    setNowPrize("")
  }, [])
  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (!data) return;

      const workbook = XLSX.read(data, {type: "binary"});
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const jsonData: any[][] = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
      });
      const firstColumnHeader = jsonData[0]?.[0]?.toString().trim();
      if (firstColumnHeader !== "Người tham gia") {
        alert("File không hợp lệ. Cột đầu tiên phải là 'Người tham gia'.");
        return;
      }

      const newLines = jsonData
        .slice(1)
        .map((row) => row[0]?.toString().trim())
        .filter((item) => item && item.length > 0);

      setLines((prevLines) => {
        setValue(newLines.join("\n"));
        return newLines;
      });
    };

    reader.readAsBinaryString(file);
  };


  const handlePrizeChange = (
    index: number,
    field: "name" | "quantity",
    value: string
  ) => {
    setPrizes((prevPrizes) =>
      prevPrizes.map((prize, idx) =>
        idx === index
          ? {...prize, [field]: field === "quantity" ? parseInt(value) || 0 : value}
          : prize
      )
    );
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTableRowElement>,
    index: number
  ) => {
    if (event.key === "Enter" && event.target instanceof HTMLInputElement) {
      event.preventDefault();
      // Only add a new row if the target is the last row
      if (index === prizes.length - 1) {
        setPrizes((prevPrizes) => [
          ...prevPrizes,
          {id: prevPrizes[prevPrizes.length - 1].id + 1, name: "", quantity: 0},
        ]);
      }
    }

    // Handle the delete action (Shift + Delete)
    if (event.key === "Delete" && event.shiftKey && prizes.length > 1) {
      setPrizes((prevPrizes) => {
        // Filter out the row at the current index
        return prevPrizes.filter((_, idx) => idx !== index);
      });
    }
  };
  const handleSpin = () => {
    // Check if all prize quantities are 0
    const allPrizesAreZero = prizes.every((prize) => prize.quantity === 0);

    if (allPrizesAreZero) {
      alert("Không có giải nào có sẵn.");
      setIsAuto(false); // Disable auto spin if all prizes have quantity 0
    } else {
      setIsAuto((prev) => !prev); // Toggle the auto-spin state
    }
  };
  return (
    <div
      className="bg-[radial-gradient(#cacbce_1px,transparent_1px)] w-[calc(100vw_-_400px)] [background-size:16px_16px] ml-[400px] min-h-[100dvh] sm:px-0 bg-bg px-5 pt-[88px] md:ml-[180px] md:w-[calc(100vw_-_180px)] sm:m-0 sm:w-full sm:pt-16"
    >
      <motion.div
        className="flex-row flex gap-3 pr-4 items-center text-xl font-semibold shadow-base z-[20] bottom-[20px] right-[20px] fixed bg-white rounded-xl p-2"
        initial={{y: 100, opacity: 0}}
        animate={{y: nowPrize.length > 0 ? 0 : 100, opacity: nowPrize.length > 0 ? 1 : 0}}
        transition={{duration: 0.5}}
      >
        <video src="/videos/wheel.mp4" className="w-[50px] h-[50px]" autoPlay muted loop/>
        {nowPrize}
      </motion.div>
      <div
        className="flex sm:px-3 relative flex-row items-center w-full md:flex-col h-[calc(100vh-88px)] md:h-[calc(100vh-4rem)] py-5 md:pt-3 md:pb-2 overflow-x-hidden ">
        <WheelComponent prize={prizes} setIsAuto={setIsAuto} setPrize={setPrizes} setValue={setValue} wheelItem={lines}
                        isAuto={isAuto}/>
        <div className="h-full flex-1">
          <Tabs defaultValue="1" className="w-[500px] sm:w-full">
            <TabsList>
              <TabsTrigger value="1">Cấu hình</TabsTrigger>
              <TabsTrigger value="2">Giải thưởng</TabsTrigger>
            </TabsList>
            <TabsContent value="1">
              <Card>
                <CardHeader>
                  <CardTitle>Cấu hình</CardTitle>
                  <CardDescription>
                    Tinh chỉnh vòng quay và thêm mới nhãn
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="lablewheel">Nhãn mới</Label>
                    <Textarea
                      rows={8}
                      value={value}
                      spellCheck={false}
                      onChange={handleChange}
                      id="lablewheel"
                      placeholder="Viết nhãn mới ở mỗi dòng"
                    />
                  </div>
                  <div className="mt-4">
                    <Label>Nhập dữ liệu từ Excel</Label>
                    <input
                      type="file"
                      accept=".xlsx, .xls"
                      onChange={handleFileUpload}
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="2">
              <Card>
                <CardHeader>
                  <CardTitle>Nhập giải thưởng</CardTitle>
                  <CardDescription>
                    - STT được sinh tự động bạn hãy điền đủ rồi ấn enter để tạo dòng
                    mới. Để xoá dòng ấn tổ hợp (shift + delete).<br/>
                    - Bấm vào nút quay liên tục sẽ thực hiện quay giải theo số thứ tự và lưu vào lịch sử vòng quay
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table
                    className="w-full  border border-black rounded-md"
                  >
                    <TableHeader>
                      <TableRow className="border-black">
                        <TableHead>STT</TableHead>
                        <TableHead className="border-x border-black">
                          Tên giải thưởng
                        </TableHead>
                        <TableHead>
                          SL giải
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {prizes.map((prize, index) => (
                        <TableRow onKeyDown={(e) => handleKeyDown(e, index)}
                                  tabIndex={0} className="border-black" key={prize.id}>
                          <TableCell>
                            {prize.id}
                          </TableCell>
                          <TableCell className="border-x border-black">
                            <Input
                              type="text"
                              value={prize.name}
                              onChange={(e) =>
                                handlePrizeChange(index, "name", e.target.value)
                              }
                              className="w-full bg-transparent border-none focus-visible:ring-offset-0 focus-visible:ring-0 outline-none"

                            />
                          </TableCell>
                          <TableCell className="w-[80px]">
                            <Input
                              value={prize.quantity}
                              onChange={(e) => {
                                const newValue = e.target.value.replace(/\D/g, "");
                                if (newValue && parseInt(newValue) > 100) {
                                  alert("Giá trị không được vượt quá 100");
                                } else {
                                  handlePrizeChange(index, "quantity", newValue);
                                }
                              }
                              }
                              className="w-full bg-transparent border-none focus-visible:ring-offset-0 focus-visible:ring-0 outline-none"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="pt-4">
                    <Button className="bg-blue-400" disabled={lines.length === 0} onClick={handleSpin}>{isAuto ?
                      <><Pause className='w-4 h-4 mr-2'/>Dừng lại</> : <><Play className='w-4 h-4 mr-2'/>Quay liên
                        tục</>}</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
