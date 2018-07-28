## memcached

#### 1.1 memcached 是什么

	
	free & open source, high-performance, distributed memory object caching system 
	
	自由&开放源码, 高性能 ,分布式的内存对象缓存系统 由 livejounal 旗下的 danga 公司开发的老牌 nosql 应用.
	

#### 1.2 什么是 NoSQL

	
	nosql，指的是非关系型的数据库。相对于传统关系型数据库的"行与列"
	
	NoSQL 的鲜明特点为 k-v 存储(memcached,redis), 或基于文档存储(mongodb)
	
	
	nosql -- not only sql , 不仅仅是关系型数据库
	
	显著特点: key-value 键值对存储,如 memcached, redis, 或基于文档存储 如,mongodb
	


#### 2.1.1  准备编译环境

		
		在 linux 编译,需要 gcc,make,cmake,autoconf,libtool 等工具, 这几件工具, 以后还要编译 redis 等使用,所以请先装.
		
		在 linux 系统联网后,用如下命令安装
		
		# yum install gcc make cmake autoconf libtool
		
		


####  2.1.2: 编译 memcached  

	
	memcached 依赖于 libevent 库,因此我们需要先安装 libevent.
	
	分别到 libevent.org 和 memcached.org 下载最新的 stable 版本(稳定版). 先编译 libevent ,再编译 memcached,
	
	编译 memcached 时要指定 libevent 的路径.
	
	过程如下: 假设源码在/usr/local/src 下, 安装在/usr/local 下
	
	
	# tar zxvf libevent-2.0.21-stable.tar.gz
	
	# cd libevent-2.0.21-stable
	
	# ./configure --prefix=/usr/local/libevent
	
	# 如果出错,读报错信息,查看原因,一般是缺少库 
	
	# make && make install
	
	# tar zxvf memcached-1.4.5.tag.gz
	
	# cd memcached-1.4.5 #./configure--prefix=/usr/local/memcached \ --with-libevent=/usr/local/libevent
	
	# make && make install
	
	在虚拟机下练习编译,一个容易碰到的问题---虚拟机的时间不对, 导致的 gcc 编译过程中,检测时间通不过,一直处于编译过程
	
	解决:
	
		# date -s ‘yyyy-mm-dd hh:mm:ss’
		
		# clock -w # 把时间写入 cmos
	
	
	
	
	启动:
		
		memcached -d -m 32 -p 11211
	
	
	


#### 2.3 memcached 的连接

	
	memcached 客户端与服务器端的通信比较简单,使用的基于文本的协议,而不是二进制协议
	
	(http 协议也是这样), 因此我们通过 telnet 即可与 memcached 作交互. 另开一个终端,并运行 telnet 命令 (开启 memcached 的终端不要关闭)
	
	# 格式 telnet host port
	
	# telnet localhost 11211 Trying ::1...
	
	Connected to localhost. Escape character is '^]'.
	
	Telnet协议:
	
	是一种应用层协议，使用于互联网及局域网中，使用虚拟终端机的形式，
	
	提供双向、以文字字符串为主的命令行接口交互功能。属于TCP/IP协议族的其中之一
	
	是Internet远程登录服务的标准协议和主要方式，常用于服务器的远程控制
	
	可供用户在本地主机运行远程主机上的工作
	


####  2.4 memcached 的命令

	分 增删改查统计 5 类,沿着这个思路来学习.
	
	增: add 往内存增加一行新记录 
	
	语法:
	add key flag expire length 回车
	value
	
	key必须是不存在的
	
	key 给值起一个独特的名字 flag 标志,要求为一个正整数 expire 有效期
	
	length 缓存的长度(字节为单位)
	
	flag 的意义:
	memcached 基本文本协议,传输的东西,理解成字符串来存储
	
	想:让你存一个 php 对象,和一个 php 数组,怎么办? 
	
		答:序列化成字符串,往出取的时候,自然还要反序列化成 对象/数组/json 格式等等. 这时候, flag 的意义就体现出来了.
		
		比如, 1 就是字符串, 2 反转成数组 3,反序列化对象.....
	
	
	expire 的意义:
		设置缓存的有效期,有 3 种格式
	
		1:设置秒数, 从设定开始数,第 n 秒后失效.
	
		2:时间戳, 到指定的时间戳后失效.
		比如在团购网站,缓存的某团到中午 12:00 失效. add key 0 1379209999 6 
	
		3: 设为 0. 不自动失效.
		注: 有种误会,设为 0,永久有效.错误的.
		1:编译 memcached 时,指定一个最长常量,默认是 30 天. 所以,即使设为 0,30 天后也会失效.
		2:可能等不到 30 天,就会被新数据挤出去
		
	删除 delete
	
	delete key [time seconds]
	删除指定的 key. 如加可选参数 time,则指删除 key,并在删除 key 后的 time 秒内,不允许 get,add,replace 操作此 key
	目的是让网站上的页面缓存也代谢完毕
	
	
	替换 replace 
	replace key flag expire length 参数和 add 完全一样,不单独写
	key 必须已经存在的
	
	
	查询 get 
	get key
	返回 key 的值
	
	set 是设置和修改值
	参数和 add ,replace 一样,但功能不一样
	
	set 想当于有 add replace 两者的功能.
	set key flag expire leng 时
	如果服务器无此键 ----> 增加的效果
	如果服务器有此键 ----> 修改的效果
	
	
	incr,decr命令:增加/减少值的大小 语法: incr/decr key num
	注意:incr,decr 操作是把值理解为 32 位无符号来+-操作的. 值在[0-2^32-1]范围内
	
	增加数值:
	
	incr key number
	
	减少数值:
	
	decr key number
	
	实际应用场景: 秒杀功能
		
		一个人下单,要牵涉数据库读取,写入订单,更改库存,及事务要求, 对于传统型数据库来说, 压力是巨大的
		
		可以利用 memcached 的 incr/decr 功能, 在内存存储 count 库存量, 秒杀 1000 台 每人抢单主要在内存操作,速度非常快,
		
		抢到 count<=1000 的号人,得一个订单号,再去另一个页面慢慢支付
		
	统计命令: stats
	
	把 memcached 当前的运行信息统计出来
	
	stat pid 2296  # 进程号
	stat uptime 4237 # 持续运行时间
	stat time 1370054990
	stat version 1.2.6
	stat pointer_size 32
	stat curr_items 4 # 当前存储的键个数 stat total_items 13
	stat bytes 236
	stat curr_connections 3
	stat total_connections 4
	stat connection_structures 4
	stat cmd_get 20   // 操作多少get
	stat cmd_set 16
	stat get_hits 13
	stat get_misses 7
	stat evictions 0
	stat bytes_read 764
	stat bytes_written 618
	stat limit_maxbytes 67108864
	stat threads 1
	end
	
	缓存有一个重要的概念: 命中率.
	
	命中率是指: 
	
		查询总数 = cmd_get
	
		查询到数据的次数 = get_hits
	
		get_hits / cmd_get * 100%
		
		查询到数据的次数/查询总数)*100% 如上, 13/(13+7) = 60+% , 的命中率
	
	清空所有的存储对象: flush_all 
	


## 第三章 memcached 的内存管理与删除机制

####  3.1 内存的碎片化

	
	如果用 c 语言直接 malloc,free 来向操作系统申请和释放内存时, 
	
	在不断的申请和释放过程中,形成了一些很小的内存片断,无法再利用.
	
	这种空闲,但无法利用内存的现象,---称为内存的碎片化.
	
	


#### 3.2 slab allocator 缓解内存碎片化

	
	memcached 用 slab allocator 机制来管理内存
	
	slab allocator 原理: 预告把内存划分成数个 slab class 仓库.(每个 slab class 大小 1M) 各仓库
	
	切分成不同尺寸的小块(chunk)
	
	需要存内容时,判断内容的大小,为其选取合理的仓库
	
		


#### 3.3 系统如何选择合适的 chunk?

	
	memcached 根据收到的数据的大小, 选择最适合数据大小的 chunk 组(slab class)
	
	memcached 中保存着 slab class 内空闲 chunk 的列表,
	
    根据该列表选择空的 chunk, 然后将数 据缓存于其中
	
	警示:
	
	如果有 100byte 的内容要存,但 122 大小的仓库中的 chunk 满了 
	
	并不会寻找更大的,如 144 的仓库来存储
	
	而是把 122 仓库的旧数据踢掉!
	 


#### 3.4 固定大小 chunk 带来的内存浪费

	
	由于 slab allocator 机制中, 分配的 chunk 的大小是”固定”的, 因此, 对于特定的 item,可能造 成内存空间的浪费
	
	比如, 将 100 字节的数据缓存到 122 字节的 chunk 中, 剩余的 22 字节就浪费了
	
	对于 chunk 空间的浪费问题,无法彻底解决,只能缓解该问题
	
	开发者可以对网站中缓存中的 item 的长度进行统计,并制定合理的 slab class 中的 chunk 的大小
	
	可惜的是,我们目前还不能自定义 chunk 的大小,但可以通过参数来调整各 slab class 中 chunk 大小的增长速度. 即增长因子, grow factor!
	


#### 3.5 grow factor 调优

	
	memcached 在启动时可以通过­f 选项指定 Growth Factor 因子, 
	
	并在某种程度上控制 slab 之 间的差异. 默认值为 1.25. 
	
	但是,在该选项出现之前,这个因子曾经固定为 2,称为”powers of 2” 策略
	
	
	
	
	当 f=1.25 时,从输出结果来看,某些相邻的 slab class 的大小比值并非为 1.25
	
	可能会觉得有些 计算误差，这些误差是为了保持字节数的对齐而故意设置的.
	


#### 3.6 memcached 的过期数据惰性删除

	
	1: 当某个值过期后,并没有从内存删除, 因此,stats 统计时, curr_item 有其信息 
	
	2: 当某个新值去占用他的位置时,当成空 chunk 来占用.
	
	3: 当 get 值时,判断是否过期,如果过期,返回空,并且清空, curr_item 就减少了.
	
	即--这个过期,只是让用户看不到这个数据而已,并没有在过期的瞬间立即从内存删除. 
	
	这个称为 lazy expiration, 惰性失效.
	
	好处--- 节省了 cpu 时间和检测的成本
	

#### 3.7: memcached 此处用的 lru 删除机制

	如果以 122byte 大小的 chunk 举例, 122 的 chunk 都满了, 又有新的值(长度为 120)要加入, 要 挤掉谁?
	
	memcached 此处用的 lru 删除机制.
	
	(操作系统的内存管理,常用 fifo,lru 删除)
	
	lru: least recently used 最近最少使用 
	
	fifo: first in ,first out
	
	原理: 当某个单元被请求时,维护一个计数器,通过计数器来判断最近谁最少被使用. 就把谁t出
	

### 3.8 memcached 中的一些参数限制

	
	key 的长度: 250 字节, (二进制协议支持 65536 个字节)
	
	value 的限制: 1m, 一般都是存储一些文本,如新闻列表等等,这个值足够了. 内存的限制: 32 位下最大设置到 2g.
	
	如果有 30g 数据要缓存,一般也不会单实例装 30g, (不要把鸡蛋装在一个篮子里), 
	
	一般建议 开启多个实例(可以在不同的机器,或同台机器上的不同端口)
     
	注: 即使某个 key 是设置的永久有效期,也一样会被踢出来! 即--永久数据被踢现象
	



## 第五章 memcached 实战

	
	任何东西,都有其适用场景,在合适的场景下,才能发挥更好的作用.
	
	对于 memcached,使用内存来存取数据,一般情况下,速度比直接从数据库和文件系统读取要 快.
	
	memcached 的最常用场景是利用其”读取快”来保护数据库,防止频率读取数据库. 
	
	也有的项目中,利用其”存储快”的特点来实现主从数据库的消息同步.
	
	


#### 5.1 缓存数据库查询结果 

	
	通过缓存数据库查询结果，减少数据库访问次数，以提高动态 Web 应用的速度、提高可扩展性
	


#### 5.2 中继 MySQL 主从延迟数据


	
	MySQL 在做 replication 时,主从复制之间必然要经历一个复制过程,即主从延迟的时间. 尤其是主从服务器处于异地机房时,这种情况更加明显.
	
	考虑如下场景:
	
	1: 用户 U 购买电子书 B, insert into Master (U,B);
	
	2: 用户 U 观看电子书 B, select 购买记录[user=’A’,book=’B’] from Slave. 3: 由于主从延迟,第2步中无记录,用户无权观看该书.
	
	这时,可以利用 memached 在 master 与 slave 之间做过渡(图 5.2):
	
	1: 用户 U 购买电子书 B, memcached->add(‘U:B’,true)
	
	2: 主数据库 insert into Master (U,B);
	
	3: 用户 U 观看电子书 B, select 购买记录[user=’U’,book=’B’] from Slave.
	
	如果没查询到,则 memcached->get(‘U:B’),查到则说明已购买但 Slave 延迟. 
	
	4: 由于主从延迟,第2步中无记录,用户无权观看该书.
	




## 一致性哈希算法原理

	
	本质是 分散压力
	
	
	


## 8 memcached 经典问题或现象

#### 8.1 缓存雪崩现象

	
	缓存雪崩一般是由某个缓存节点失效,导致其他节点的缓存命中率下降
	
		缓存中缺失的数据 去数据库查询.短时间内,造成数据库服务器崩溃
	
		重启 DB,短期又被压跨,但缓存数据也多一些.
	
		DB 反复多次启动多次,缓存重建完毕,DB 才稳定运行.
	
	或者
	
	是由于缓存周期性的失效
	
		比如每 6 小时失效一次,那么每 6 小时,将有一个请求”峰值”, 严重者甚至会令 DB 崩溃
	


#### 8.2 缓存的无底洞现象 multiget-hole

	
	该问题由 facebook 的工作人员提出的, facebook 在 2010 年左右,memcached 节点就已经达 3000 个.缓存数千 G 内容
	
	他们发现了一个问题---memcached 连接频率,效率下降了,于是加 memcached 节点, 添加了后,发现因为连接频率导致的问题
	
	仍然存在,并没有好转,称之为”无底洞现象”.
	

	
	事实上:
	
	NoSQL 和传统的 RDBMS,并不是水火不容,两者在某些设计上,是可以相互参考的
	
	对于 memcached, redis 这种 kv 存储, key 的设计,可以参考 MySQL 中表/列的设计. 
	
	比如: user 表下,有 age 列,name 列,身高列,
	
	对应的 key,可以用 user:133:age = 23, user:133:name = ‘lisi’, user:133:height = 168;
	
	

	
	把某一组 key,按其共同前缀,来分布
	
	比如 user-133-age, user-133-name,user-133-height 这 3 个 key, 
	
	在用分布式算法求其节点时,应该以 ‘user-133’来计算,而不是以 user-133-age/name/height 来 计算
	
	这样,3 个关于个人信息的 key,都落在同 1 个节点上,访问个人主页时,只需要连接 1 个节点. 问题解决.
	


#### 8.3 永久数据被踢现象

	
	网上有人反馈为"memcached 数据丢失",明明设为永久有效,却莫名其妙的丢失了.
	
	其实,这要从 2 个方面来找原因:
	
		惰性删除
		
		LRU 最近最少使用记录删除
	
	1:如果 slab 里的很多 chunk,已经过期,但过期后没有被 get 过, 系统不知他们已经过期.
	
	2:永久数据很久没 get 了,不活跃,如果新增 item,则永久数据被踢了
	
	3: 当然,如果那些非永久数据被 get,也会被标识为 expire,从而不会再踢掉永久数据
	
	
	
	解决方案: 永久数据和非永久数据分开放
	
