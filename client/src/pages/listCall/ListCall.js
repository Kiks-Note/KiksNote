import { useEffect, useRef, useState } from "react";
import axios from "axios";

function ListCall() {

  return (

    <div style={{padding: "20px"}} class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3">
                    Nom     
                </th>
                <th scope="col" class="px-6 py-3">
                    Classe
                </th>
                <th scope="col" class="px-6 py-3">
                    Cours
                </th>
                <th scope="col" class="px-6 py-3">
                    Date
                </th>
                <th scope="col" class="px-6 py-3">
                    Status
                </th>
            </tr>
        </thead>
        <tbody>
            <tr class="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        Maxence
                </th>
                <td class="px-6 py-4">
                    L1TP
                </td>
                <td class="px-6 py-4">
                    HTML/CSS
                </td>
                <td class="px-6 py-4">
                    21/09/2022
                </td>
                <td class="px-6 py-4">
                    Présent
                </td>
            </tr>
            <tr class="border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        Maxence
                </th>
                <td class="px-6 py-4">
                    L1TP
                </td>
                <td class="px-6 py-4">
                    HTML/CSS
                </td>
                <td class="px-6 py-4">
                    21/09/2022
                </td>
                <td class="px-6 py-4">
                    Présent
                </td>
            </tr>
            <tr class="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        Maxence
                </th>
                <td class="px-6 py-4">
                    L1TP
                </td>
                <td class="px-6 py-4">
                    HTML/CSS
                </td>
                <td class="px-6 py-4">
                    21/09/2022
                </td>
                <td class="px-6 py-4">
                    Présent
                </td>
            </tr>
            <tr class="border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        Maxence
                </th>
                <td class="px-6 py-4">
                    L1TP
                </td>
                <td class="px-6 py-4">
                    HTML/CSS
                </td>
                <td class="px-6 py-4">
                    21/09/2022
                </td>
                <td class="px-6 py-4">
                    Présent
                </td>
            </tr>
            <tr>
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        Maxence
                </th>
                <td class="px-6 py-4">
                    L1TP
                </td>
                <td class="px-6 py-4">
                    HTML/CSS
                </td>
                <td class="px-6 py-4">
                    21/09/2022
                </td>
                <td class="px-6 py-4">
                    Présent
                </td>
            </tr>
        </tbody>
    </table>
</div>

        

  );
}

export default ListCall;
