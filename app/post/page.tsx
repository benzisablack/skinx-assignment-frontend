'use client';

import axiosInstance from '@/libs/axios';
import { EyeOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import { Button, Card, Col, Input, Modal, Row, Select, Space, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';

export default function Post() {
  const [data, setData] = useState<any[]>([]);
  const [tagList, setTagList] = useState<[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [meta, setMeta] = useState<Meta>({
    itemCount: 0,
    page: 1,
    pageCount: 0,
    take: 10,
    search: '',
  });

  useEffect(() => {
    const fetchTagsList = async () => {
      const response = await axiosInstance.get('/v1/post/get-tags');
      const options = response.data.map((tag: any) => {
        return {
          label: tag.name,
          value: tag.id,
        };
      });
      setTagList(options);
    };

    const fetchPostData = async () => {
      setLoading(true);
      const response = await axiosInstance.get('/v1/post', {
        params: {
          page: meta.page,
          take: meta.take,
          search: meta.search,
          tags: meta.tags,
        },
      });
      setData(response.data.data);
      setMeta(response.data.meta);
      setLoading(false);
    };

    fetchPostData();
    fetchTagsList();
  }, [meta.page, meta.search, meta.tags, meta.take]);

  const handleSearch = () => {};

  const columns: TableProps<DataType>['columns'] = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Posted by',
      dataIndex: 'postedBy',
      key: 'postedBy',
    },
    {
      title: 'Posted At',
      dataIndex: 'postedAt',
      key: 'postedAt',
      width: 180,
      render: (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      },
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      width: 200,
      render: (tags: any) => {
        return (
          <>
            {tags.map((tag: { id: string; name: string }) => (
              <Tag key={tag.id}>{tag.name}</Tag>
            ))}
          </>
        );
      },
    },
    {
      title: 'View Content',
      key: 'action',
      align: 'center',
      width: 120,
      render: (record: any) => {
        return (
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              showModal(record.content);
            }}
          ></Button>
        );
      },
    },
  ];

  const onSearchChange = (value: string) => {
    setMeta({
      ...meta,
      search: value,
    });
  };

  const handleChange = (value: string | string[]) => {
    setMeta({
      ...meta,
      tags: Array(value).join(','),
    });
  };

  const handlePageChange = (pagination: any) => {
    setMeta({
      ...meta,
      page: pagination.current,
      take: pagination.pageSize,
    });
  };

  const showModal = (content: string) => {
    setContent(content);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <Row gutter={[16, 16]} justify='center' style={{ marginTop: '50px' }}>
        <Col span={22}>
          {data.length > 0 && (
            <>
              <Card
                title='Posts'
                extra={
                  <Space>
                    <Input placeholder='search title' onChange={(e) => onSearchChange(e.target.value)} />
                    <Select
                      mode='tags'
                      placeholder='Please select tags'
                      onChange={handleChange}
                      style={{ width: '300px' }}
                      options={tagList}
                      allowClear
                    />
                    {/* <Button type='primary' icon={<SearchOutlined />}>
                      Search
                    </Button> */}
                  </Space>
                }
              >
                <Table
                  dataSource={data}
                  columns={columns}
                  loading={loading}
                  pagination={{
                    current: meta.page,
                    total: meta.itemCount,
                    pageSize: meta.take,
                    pageSizeOptions: [10, 20, 50, 100],
                  }}
                  onChange={handlePageChange}
                  bordered
                  size='small'
                />
              </Card>
              <Modal title='Content' open={isModalOpen} onCancel={handleCancel} footer={null} width='80vw'>
                <div dangerouslySetInnerHTML={{ __html: content }}></div>
              </Modal>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
}
