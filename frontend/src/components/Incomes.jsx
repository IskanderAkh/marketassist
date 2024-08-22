import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react'
import axios from 'axios';

const ReportDetailByPeriod = () => {
    const apiKey = 'eyJhbGciOiJFUzI1NiIsImtpZCI6IjIwMjQwODAxdjEiLCJ0eXAiOiJKV1QifQ.eyJlbnQiOjEsImV4cCI6MTczODYyODE2OCwiaWQiOiIzMjk0NjZiMC01NDFhLTRmOTItOGZkMC03ODM2ZGE0MzNmZWQiLCJpaWQiOjY1NDkwMTA4LCJvaWQiOjQ4MDAwNCwicyI6MTA3Mzc0ODAwNCwic2lkIjoiODMwNDVmZWEtMWY5MC00ZjRhLWJkMjktYTYxMTZlMDQyMmMxIiwidCI6ZmFsc2UsInVpZCI6NjU0OTAxMDh9.Axi_SojtSCKufmb-LKb1zqC6DuLKfzyRfvDde2wKfhvro8i1s7cTzIA31WckGIiFuLc7YbKj3yyPFuGu_Kjgiw';
    const url = 'https://statistics-api.wildberries.ru/api/v5/supplier/reportDetailByPeriod';
    const [array, setArray] = useState()
    const params = {
        dateFrom: '2024-01-01',  // Начальная дата периода
        dateTo: '2024-08-31',    // Конечная дата периода
        limit: 100,              // Количество записей, которое вы хотите получить
        rrdid: ''                // Если нужно, можно добавить фильтр по конкретным RRDID});
    }
    const { data, isLoading } = useQuery({
        queryKey: ['sold'],
        queryFn: async () => {
            try {
                const res = await axios.get(url, {
                    headers: {
                        'Authorization': apiKey,
                        'Content-Type': 'application/json'
                    },
                    params: params
                });
                console.log(res.data);
                localStorage.setItem('items', res.data)
                return res.data; // Return the data from the response
            } catch (error) {
                console.log(error);
                throw error; // Re-throw the error to be handled by useQuery
            }
        }
    });
    let totalPaid = 0
    data?.map((item) => {
        totalPaid += Number(item.forPay)
    })
    return (
        <div>
            <div className="overflow-x-auto">
                <table className="table table-xs">
                    <thead>
                        <tr>
                            <th>Barcode</th>
                            <th>Name</th>
                            <th>WarehouseName</th>
                            <th>Brand</th>
                            <th>Logistics cost</th>
                            <th>Location</th>
                            <th>Date</th>
                            <th>Supplied</th>
                            <th>Paid</th>
                            <th>Total Paid</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data?.map((item, i) => (
                                <tr>
                                    <th>{item.realizationreport_id}</th>
                                    <th>{item.subject_name}</th>
                                    <th>{item.warehouseName}</th>
                                    <th>{item.brand_name}</th>
                                    <th>{item.rebill_logistic_cost}</th>
                                    <th>{item.ppvz_office_name}</th>
                                    <th>{item.date}</th>
                                    <th>{item.isRealization}</th>
                                    <th>₽ {item.ppvz_for_pay}</th>
                                    {i == 0 && <th>₽ {totalPaid}</th>}
                                </tr>
                            ))
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>WarehouseName</th>
                            <th>company</th>
                            <th>location</th>
                            <th>Date</th>
                            <th>Supplied</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}

export default ReportDetailByPeriod