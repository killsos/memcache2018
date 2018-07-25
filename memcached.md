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
		
		
