# nysdaq

- 코스닥+코스피 25일 이동평균선 괴리율 계산 프로젝트.
- 섹터마다 다르지만 괴리율이 15~20% 이상 벌어지는 경우 기술적 약 반등을 노리는 스윙 매매법.
- [BNF](https://namu.wiki/w/BNF) 매매기법이라 불리기도 함. 
- 구현된 사이트 [http://nysdaq.iinfo.kr:7000](http://nysdaq.iinfo.kr:7000)


## mardiadb or myssql install.
## 1. mariadb,mysql install.

```
- apt-get update
- apt-get install mariadb-server
- sudo mysql_secure_installation
- sudo mysql -u root -p
- UPDATE user SET plugin='mysql_native_password' WHERE User='root';

INSERT INTO mysql.user (host,user,password,authentication_string, ssl_cipher, x509_issuer, x509_subject) VALUES ('%','nysdaq',password('nysdaq'), password('nysdaq'),'','','');
GRANT ALL PRIVILEGES ON *.* TO 'nysdaq'@'%';
FLUSH PRIVILEGES;

- FLUSH PRIVILEGES;
```

```
cd /etc/mysql/mariadb.conf.d
sudo vi 50-server.cnf 
service mysql restart

#bind-address            = 127.0.0.1
[mysqld]
bind-address            = 0.0.0.0
```

## 2. 한국거래소 종목 리스트 다운로드 

http://kind.krx.co.kr/corpgeneral/corpList.do?method=download&searchType=13

>excel download.

## 3. 한국거래소 typescript 기반 api 소스 참고

https://github.com/Shin-JaeHeon/krx-stock-api

## 4. 한국거래소 시세 API 주소 

- view-source:http://asp1.krx.co.kr/servlet/krx.asp.XMLSise?code=035420

- view-source:http://asp1.krx.co.kr/servlet/krx.asp.XMLSise?code=035420

>이슈. 일부 종목은 시세가 나오지 않음. 시세가 나오지 않는 건 네이버나 다음, 기타 스크래핑을 적절히 활용해야 할 것 같음.아니면 일시적 장애로 받아야 될듯.
그에 따라 krx 시세 조회를 돌려봤으나 20~30%정도나 조회가 되지 않아서 방향을 바꿈. 네이버나 다음 증권 사이트를 스크래핑 하는것이 좋겠음.

## 5. 네이버 종목 시세 조회 api 

- 모바일 버전
https://m.stock.naver.com/api/item/getPriceDayList.nhn?code=005930&pageSize=20&page=1

- 피씨 버전
https://finance.naver.com/item/sise_day.nhn?code=066570&page=1

>모바일버전 응답이 훨씬 경량화 되어있어 **모바일 버전을 사용할 것.** 더군다나 pageSize까지 옵션으로 제공하고 있어서 오히려 좋아.
비공식 api에 대한 웹 스크래핑 시 ddos, 웹방화벽 정책을 회피하기 위해 요청 마다 간격을 두는 것이 좋음. 현재 0.2 sec 간격으로 스크래핑 돌리고 있음. 



```javascript

const sleep = (ms) => {
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

await util.sleep(200);
```


