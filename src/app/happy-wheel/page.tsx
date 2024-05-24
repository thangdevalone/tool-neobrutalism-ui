"use client";
import WheelComponent from "@/components/common/wheel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { WheelItem } from "@/models";
import { ChangeEvent, useState } from "react";
export default function HappyWheel() {
  const [data, setData] = useState<WheelItem[]>();
  const [value,setValue]=useState('')
  const handleChange = (event:ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
    
  };
  return (
    <div className="bg-[radial-gradient(#cacbce_1px,transparent_1px)]  [background-size:16px_16px] ml-[250px] min-h-[100dvh] sm:px-0 w-[calc(100vw_-_250px)] bg-bg px-5 pt-[88px] md:ml-[180px] md:w-[calc(100vw_-_180px)] sm:m-0 sm:w-full sm:pt-16">
      <div
        className="flex sm:px-3 relative flex-row items-center w-full md:flex-col h-[calc(100vh-88px)] md:h-[calc(100vh-4rem)] py-5 md:pt-3 md:pb-2 overflow-x-hidden "
      >
        <WheelComponent setValue={setValue} wheelItem={value} />
        <div className="h-full absoulte">
          <Tabs  defaultValue="1" className="w-[400px] sm:w-full">
            <TabsList>
              <TabsTrigger value="1">Cấu hình</TabsTrigger>
              <TabsTrigger value="2">Lịch sử</TabsTrigger>
              <TabsTrigger value="3">Tỉ lệ</TabsTrigger>
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
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="2">Change your password here.</TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
