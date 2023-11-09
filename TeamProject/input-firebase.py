import firebase_admin #firebase와 연동을 위해 import
from firebase_admin import credentials #인증관련
from firebase_admin import db #DB 제어 관련
import datetime
import serial #시리얼 통신을 위한 모듈
import serial.tools.list_ports #포트 순회를 위한 포트 참조
import threading #프로그램 실행시 스레드 생성을 위함 
import time

#firebase접속을 위한 구문
cred = credentials.Certificate("./개인firebase키")
firebase_admin.initialize_app(cred,{
    'databaseURL' : '개인firebase주소'
})

BriValue=""
Fdistance=""
Bdistance=""




serial_receive_data = ""

def serial_read_thread(): #명령어에 대한 회신을 받아서 디코딩
    global serial_receive_data
    while True:
        read_data=my_serial.readline()
        serial_receive_data=read_data.decode()

def send_1sec(): 
    t2 = threading.Timer(0.1,send_1sec) #1초마다 재귀호출을 하는 스레드 생성
    t2.daemon=True
    t2.start()
    time.sleep(2.0)



def input_rtdb(BriValue,Fdistance,Bdistance):
    now=datetime.datetime.now()
    now_date=now.strftime('%Y-%m-%d')
    now_time=now.strftime('%H:%M:%S')
    #dir = db.reference(now_date+'/categori') 
    if bool (BriValue or Fdistance or Bdistance):
        if BriValue:
            dir = db.reference(now_date + '/BriValue') 
            dir.push({
                'inputTime': now_time,
                'briValue':BriValue
            })
        elif Fdistance:
            dir = db.reference(now_date + '/FrontDistance') 
            dir.push({
                'inputTime': now_time,
                'frontDistance':Fdistance
            })
        elif Bdistance:
            dir = db.reference(now_date + '/BackDistance') 
            dir.push({
                'inputTime': now_time,
                'backDistance':Bdistance
            })
    
    print (now_date)
    print (now_time)

def main():
    try:
        send_1sec() # 주기적으로 데이터 입력을 요청하는 스레드 시작 
        global serial_receive_data
        global BriValue
        global Fdistance
        global Bdistance
        while True:
            if bool(serial_receive_data) :           
                if "현재 밝기 :" in serial_receive_data:
                    print("현재 밝기 :",serial_receive_data[8:])
                    BriValue=serial_receive_data[8:]
                    serial_receive_data=""
                elif"후방 거리 : 약 " in serial_receive_data:
                    print("후방 거리 : 약 ",serial_receive_data[9:])
                    Bdistance=serial_receive_data[9:]
                    serial_receive_data=""
                elif"전방 거리 : 약 " in serial_receive_data:
                    print("전방 거리 : 약 ",serial_receive_data[9:])
                    Fdistance=serial_receive_data[9:]
                    serial_receive_data=""
                else:
                    pass
                input_rtdb(BriValue,Fdistance,Bdistance)
                BriValue=""
                Fdistance=""
                Bdistance=""

                #resetData(BriValue,Fdistance,Bdistance)
    except KeyboardInterrupt:# Ctrl + C 를 통해 종료
        pass




if __name__=="__main__": #메인 스레드일 경우에만 동작한다.
    ports=list(serial.tools.list_ports.comports())#usb포트에 있는 넘들 리스트로 가져와서 
    
    for p in ports:#wemos보드가 있으면 연결한다.
        if 'CH340' in p.description:
            print(f"{p} 포트에 연결하였습니다.")
            my_serial = serial.Serial(p.device,baudrate=9600, timeout=1.0)
            time.sleep(2.0)
    t1=threading .Thread(target=serial_read_thread) #작업 단위 하나 추가
    t1.daemon=True  #데몬:메인 스레드가 종료될 때 함께 종료되는 스레드
    t1.start()

    
    main()

    my_serial.close()
