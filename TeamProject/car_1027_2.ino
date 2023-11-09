#include <ESP8266WiFi.h>

#define WIFI_SSID "개인와파이름"
#define WIFI_PASSWORD "개인와파비번"

#define CDS_PIN A0
#define BUZZER D3
#define MAINLED_PIN D4
#define SUBLED_PIN D5
#define FRONT_ECHO D6
#define FRONT_TRIG D7
#define BACK_TRIG D11
#define BACK_ECHO D12

void setup() {

    Serial.begin(9600);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    while(WiFi.status() != WL_CONNECTED) {
        Serial.print(".");
        delay(500);
    }

    Serial.println("");
    Serial.println("WiFi connected.");
    Serial.print("IP address : ");
    Serial.println(WiFi.localIP());
    Serial.println();

    pinMode(CDS_PIN, INPUT);
    pinMode(BUZZER, OUTPUT);
    pinMode(MAINLED_PIN, OUTPUT);
    pinMode(SUBLED_PIN, OUTPUT);
    pinMode(FRONT_TRIG, OUTPUT);
    pinMode(FRONT_ECHO, INPUT);
    pinMode(BACK_TRIG, OUTPUT);
    pinMode(BACK_ECHO, INPUT);
}

/* 오토라이트 */
void bri_Action() {

    // 조도 센서 값 받아 시리얼 출력하기
    int briVal = analogRead(CDS_PIN);
    int briPer = map(briVal, 0, 1023, 0, 100);

    // 밝기 퍼센트에 따라 자동차 라이트 점등/소등하기
    if(briPer <= 50){
        digitalWrite(MAINLED_PIN, HIGH);
        Serial.print("현재 밝기 : ");
        Serial.print(briPer);
        Serial.println("%");
        delay(1000);
    }
    else{
        Serial.print("현재 밝기 : ");
        Serial.print(briPer);
        Serial.println("%");
        digitalWrite(MAINLED_PIN, LOW);
        delay(1000);
    }

}

/* 전방 센서 */
void front_Action() {

    // 전방 거리 받기
    digitalWrite(FRONT_TRIG, HIGH);
    delayMicroseconds(10);
    digitalWrite(FRONT_TRIG, LOW);

    unsigned long front_duration = pulseIn(FRONT_ECHO, HIGH);

    // 음파가 되돌아온 시간을 cm로 환산하는 공식
    float front_distanceCM = ((34000.0*(float)front_duration)/1000000.0)/2.0;

    // 전방 거리에 따라 부저 소리 출력하기
    if(front_distanceCM < 50.0 && front_distanceCM > 15.0){
        Serial.print("전방 거리 : 약 ");
        Serial.print(front_distanceCM);
        Serial.println("cm");
        noTone(BUZZER);
        delay(1000);
    }
    else if(front_distanceCM <= 15.0 && front_distanceCM > 10.0){
        Serial.print("전방 거리 : 약 ");
        Serial.print(front_distanceCM);
        Serial.println("cm");
        tone(BUZZER, 392); // 392 = 음계 '솔' 주파수
        delay(300);
        noTone(BUZZER);

        delay(1000);
    }
    else if(front_distanceCM <= 10.0 && front_distanceCM > 5.0){
        Serial.print("전방 거리 : 약 ");
        Serial.print(front_distanceCM);
        Serial.println("cm");
        tone(BUZZER, 392);
        delay(150);
        noTone(BUZZER);
        delay(1000);
    }
    else if(front_distanceCM <= 5.0 && front_distanceCM > 0.0 ){
        Serial.print("전방 거리 : 약 ");
        Serial.print(front_distanceCM);
        Serial.println("cm");
        tone(BUZZER, 392);

        delay(1000);
    }
    else if(front_distanceCM <= 0.0){
      noTone(BUZZER);
      front_distanceCM = 0;
      return;
    }
    else{
      front_distanceCM = 0;
      noTone(BUZZER);
    }
}

/* 후방 사이드 센서 */
void back_Action() {

    // 후방 거리 받아 출력하기
    digitalWrite(BACK_TRIG, HIGH);
    delayMicroseconds(10);
    digitalWrite(BACK_TRIG, LOW);

    unsigned long back_duration = pulseIn(BACK_ECHO, HIGH);

    float back_distanceCM = ((34000.0*(float)back_duration)/1000000.0)/2.0;

    // 후방 거리에 따라 후방용 SUB LED 점등/소등하기
    if(back_distanceCM <= 15.0){
        digitalWrite(SUBLED_PIN, HIGH);
    }
    else{
        digitalWrite(SUBLED_PIN, LOW);
    }

    // 후방 거리에 따라 부저 소리 출력하기
    if(back_distanceCM < 50.0 && back_distanceCM > 15.0){
        Serial.print("후방 거리 : 약 ");
        Serial.print(back_distanceCM);
        Serial.println("cm");
        noTone(BUZZER);
        delay(1000);
    }
    else if(back_distanceCM <= 15.0 && back_distanceCM > 10.0){
        Serial.print("후방 거리 : 약 ");
        Serial.print(back_distanceCM);
        Serial.println("cm");
        tone(BUZZER, 392); // 392 = 음계 '솔' 주파수
        delay(300);
        noTone(BUZZER);

        delay(1000);
    }
    else if(back_distanceCM <= 10.0 && back_distanceCM > 5.0){
        Serial.print("후방 거리 : 약 ");
        Serial.print(back_distanceCM);
        Serial.println("cm");
        tone(BUZZER, 392);
        delay(150);
        noTone(BUZZER);
        delay(1000);
    }
    else if(back_distanceCM <= 5.0 && back_distanceCM > 0.0){
        Serial.print("후방 거리 : 약 ");
        Serial.print(back_distanceCM);
        Serial.println("cm");
        tone(BUZZER, 392);

        delay(1000);
    }
    else if(back_distanceCM <= 0.0){
      noTone(BUZZER);
      back_distanceCM = 0;
      return;
    }
    else{
      back_distanceCM = 0;
      noTone(BUZZER);

    }
}

void loop() {
    bri_Action();
    front_Action();
    back_Action();
}